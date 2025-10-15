const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Roads', 'Utilities', 'Public Safety', 'Sanitation', 'Parks', 'Street Lighting', 'Other']
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['open', 'in progress', 'resolved', 'closed'],
    default: 'open'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Issue', issueSchema);