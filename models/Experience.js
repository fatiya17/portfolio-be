const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  location: String,
  period: String,
  type: String,
  description: String,
  link: String,
  skills: [String] 
});

module.exports = mongoose.model('Experience', experienceSchema);