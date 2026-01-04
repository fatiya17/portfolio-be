const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  date: String,
  credentialId: String,
  verifyLink: String,
  imageUrl: String,
  description: String
});

module.exports = mongoose.model('Certificate', certificateSchema);