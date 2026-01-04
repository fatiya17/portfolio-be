const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  category: String,
  color: String, 
  bg: String, 
  iconName: String, 
  items: [{
    name: String,
    iconKey: String, 
    color: String 
  }]
});

module.exports = mongoose.model('Skill', skillSchema);