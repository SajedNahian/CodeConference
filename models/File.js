const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    default: 'java'
  },
  fileName: {
    type: String,
    default: 'file.java'
  },
  textContent: {
    type: String
  }
});

module.exports = File = mongoose.model('file', FileSchema);
