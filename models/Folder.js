const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  nickname: {
    type: String
  },
  password: {
    type: String
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'file'
    }
  ]
});

module.exports = Folder = mongoose.model('folder', FolderSchema);
