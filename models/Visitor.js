const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: String,
  country: String,
  city: String,
  device: String, // mobile/desktop
  platform: String, // os
  browser: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Visitor', visitorSchema);