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
app.use(express.json());

// connect db
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---

// 1. projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. experience
app.get('/api/experience', async (req, res) => {
  try {
    const experiences = await Experience.find(); // sort logic can be added
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. education
app.get('/api/education', async (req, res) => {
  try {
    const education = await Education.find();
    res.json(education);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. certificates
app.get('/api/certificates', async (req, res) => {
  try {
    const certs = await Certificate.find();
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));