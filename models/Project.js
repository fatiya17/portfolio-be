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
  features: {
    type: String 
  },
  // Link & Visual
  imageUrl: {
    type: String, 
    default: "https://via.placeholder.com/300" 
  },
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