const mongoose = require('mongoose');

const announceSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  authorImg: {
    type: String,
  },
  role: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true
  },
  liked: {
    type: Boolean,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('announcement', announceSchema);