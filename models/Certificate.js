const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  issuer: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  // added credential id field
  credentialId: {
    type: String
  },
  // renamed to match frontend (verifyLink)
  verifyLink: {
    type: String
  },
  // added description field
  description: {
    type: String
  },
  // image field for upload
  imageUrl: {
    type: String,
    default: "https://via.placeholder.com/300"
  },
  category: {
    type: String,
    default: "Others"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Certificate', CertificateSchema);