require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// import models
const Project = require('./models/Project');
const Certificate = require('./models/Certificate');
// Tambahkan model lain jika perlu (Experience/Education)

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (imageString, folder) => {
  if (!imageString || !imageString.startsWith('data:image')) {
    return imageString; 
  }
  try {
    console.log('⏳ Uploading image...');
    const res = await cloudinary.uploader.upload(imageString, {
      folder: `portfolio/${folder}`,
      resource_type: "image"
    });
    return res.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Error:", error.message);
    return null; 
  }
};

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    // 1. migrate projects
    const projects = await Project.find({});
    console.log(`🔍 Found ${projects.length} projects. Checking images...`);

    for (let p of projects) {
      let isChanged = false;
      
      // Cek Main Image
      if (p.imageUrl && p.imageUrl.startsWith('data:image')) {
        const newUrl = await uploadToCloudinary(p.imageUrl, 'projects');
        if (newUrl) {
          p.imageUrl = newUrl;
          isChanged = true;
          console.log(`✅ Project "${p.title}" cover image updated.`);
        }
      }

      // check gallery images
      if (p.gallery && p.gallery.length > 0) {
        for (let g of p.gallery) {
          if (g.url && g.url.startsWith('data:image')) {
            const newGalleryUrl = await uploadToCloudinary(g.url, 'projects');
            if (newGalleryUrl) {
              g.url = newGalleryUrl;
              isChanged = true;
              console.log(`✅ Project "${p.title}" gallery image updated.`);
            }
          }
        }
      }

      if (isChanged) {
        await p.save();
        console.log(`💾 Project "${p.title}" saved to DB.`);
      }
    }

    // 2. migrate certificates
    const certs = await Certificate.find({});
    console.log(`\n🔍 Found ${certs.length} certificates. Checking images...`);
    
    for (let c of certs) {
      if (c.imageUrl && c.imageUrl.startsWith('data:image')) {
        const newUrl = await uploadToCloudinary(c.imageUrl, 'certificates');
        if (newUrl) {
          c.imageUrl = newUrl;
          await c.save();
          console.log(`✅ Certificate "${c.title}" updated.`);
        }
      }
    }

    console.log('\n🎉 MIGRATION COMPLETED!');
    process.exit();
  } catch (err) {
    console.error('❌ Migration Failed:', err);
    process.exit(1);
  }
};

migrate();