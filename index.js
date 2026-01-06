require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// import models
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Certificate = require('./models/Certificate');
const Skill = require('./models/Skill');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.get('/', (req, res) => {
  res.send('🦉 Backend for Fatiya’s Portfolio Is Live!');
});

// connect db
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- 🔐 auth route ---
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-token-secret-123' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Password' });
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
    const newItem = new Project(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
app.put('/api/projects/:id', async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    const newItem = new Certificate(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
app.put('/api/certificates/:id', async (req, res) => {
  try {
    const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
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