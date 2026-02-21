const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: String,
  school: String,
  year: String,
  grade: String,
  link: String,
  imageUrl: String
});

module.exports = mongoose.model('Education', educationSchema);