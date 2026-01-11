require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2; 

// import models
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Certificate = require('./models/Certificate');
const Skill = require('./models/Skill');
const Visitor = require('./models/Visitor');

const app = express();
const PORT = process.env.PORT || 5000;

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- ⚡ database connection setup for vercel ⚡ ---
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // fail fast if not connected
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected (New Connection)');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// middleware: ensure db connected before handling request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("❌ Database Error:", error);
    res.status(500).json({ message: "Database Connection Failed" });
  }
});
// --------------------------------------------------

app.get('/', (req, res) => {
  res.send('🦉 Backend for Fatiya’s Portfolio Is Live!');
});

// helper function to upload image
const uploadToCloudinary = async (imageString, folder) => {
  // if not base64 or empty, return original string (it might be a url already)
  if (!imageString || !imageString.startsWith('data:image')) {
    return imageString; 
  }
  try {
    const uploadResponse = await cloudinary.uploader.upload(imageString, {
      folder: `portfolio/${folder}`,
      resource_type: "image"
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

// --- 🔐 auth route ---
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-token-secret-123' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Password' });
  }
});

// --- analytics routes ---

// track visitor
app.post('/api/track', async (req, res) => {
  try {
    const { country, city, device, platform, browser } = req.body;
    // get ip from request header (vercel/proxies support)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // simple check to prevent spamming db on hot reload (optional)
    // in production, you might want to debounce this on the client side
    
    await Visitor.create({
      ip,
      country: country || 'Unknown',
      city: city || 'Unknown',
      device,
      platform,
      browser
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('tracking error', err);
    // don't block the client if tracking fails
    res.status(200).json({ success: false }); 
  }
});

// get analytics data
app.get('/api/analytics', async (req, res) => {
  try {
    // 1. total visits
    const totalVisits = await Visitor.countDocuments();
    
    // 2. unique visitors (distinct ips)
    const uniqueVisitors = (await Visitor.distinct('ip')).length;
    
    // 3. visits by country (top 5)
    const topCountries = await Visitor.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // 4. visits last 7 days (for chart)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const visitsByDate = await Visitor.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalVisits,
      uniqueVisitors,
      topCountries,
      visitsByDate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 📂 CRUD routes ---

// 1. projects
app.get('/api/projects', async (req, res) => {
  try {
    const data = await Project.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/projects', async (req, res) => {
  try {
    const body = req.body;
    
    // upload main image
    if (body.imageUrl) {
      body.imageUrl = await uploadToCloudinary(body.imageUrl, 'projects');
    }
    
    // upload gallery images
    if (body.gallery && Array.isArray(body.gallery)) {
      for (let i = 0; i < body.gallery.length; i++) {
        if (body.gallery[i].url) {
           body.gallery[i].url = await uploadToCloudinary(body.gallery[i].url, 'projects');
        }
      }
    }

    const newItem = new Project(body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const body = req.body;
    
    // upload main image if changed
    if (body.imageUrl) {
      body.imageUrl = await uploadToCloudinary(body.imageUrl, 'projects');
    }
    
    // upload gallery images if changed
    if (body.gallery && Array.isArray(body.gallery)) {
      for (let i = 0; i < body.gallery.length; i++) {
        if (body.gallery[i].url) {
           body.gallery[i].url = await uploadToCloudinary(body.gallery[i].url, 'projects');
        }
      }
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. experience
app.get('/api/experience', async (req, res) => {
  try {
    const data = await Experience.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
app.post('/api/experience', async (req, res) => {
  try {
    const newItem = new Experience(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
app.put('/api/experience/:id', async (req, res) => {
  try {
    const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
app.delete('/api/experience/:id', async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 3. education
app.get('/api/education', async (req, res) => {
  try {
    const data = await Education.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
app.post('/api/education', async (req, res) => {
  try {
    const newItem = new Education(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
app.put('/api/education/:id', async (req, res) => {
  try {
    const updated = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
app.delete('/api/education/:id', async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ message: 'Education Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 4. certificates
app.get('/api/certificates', async (req, res) => {
  try {
    const data = await Certificate.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const body = req.body;
    // upload image if exists
    if (body.imageUrl) {
      body.imageUrl = await uploadToCloudinary(body.imageUrl, 'certificates');
    }
    const newItem = new Certificate(body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/certificates/:id', async (req, res) => {
  try {
    const body = req.body;
    // upload image if changed
    if (body.imageUrl) {
      body.imageUrl = await uploadToCloudinary(body.imageUrl, 'certificates');
    }
    const updated = await Certificate.findByIdAndUpdate(req.params.id, body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/certificates/:id', async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 5. skills
app.get('/api/skills', async (req, res) => {
  try {
    const data = await Skill.find();
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
app.post('/api/skills', async (req, res) => {
  try {
    const newItem = new Skill(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
app.put('/api/skills/:id', async (req, res) => {
  try {
    const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
app.delete('/api/skills/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;