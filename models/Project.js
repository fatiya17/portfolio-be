const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  techStack: {
    type: [String],
    required: true
  },
  problemSolved: {
    type: String
  },
  
  projectType: {
    type: String, 
    default: "Individual"
  },
  duration: {
    type: String 
  },
  year: {
    type: String
  },
  teamSize: {
    type: Number,
    default: 1
  },
  
  // link & visual
  imageUrl: {
    type: String, 
    default: "https://via.placeholder.com/300" 
  },
  // --- gallery for multi image & caption ---
  gallery: [
    {
      url: String,
      caption: String
    }
  ],
  
  githubLink: {
    type: String
  },
  demoLink: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);