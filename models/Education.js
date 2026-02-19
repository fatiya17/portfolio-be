const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: String,
  school: String,
  year: String,
  grade: String,
  desc: String,
  imageUrl: String
});

module.exports = mongoose.model('Education', educationSchema);