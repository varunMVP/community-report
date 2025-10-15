const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Issue = require('../models/Issue');
const { auth, adminAuth } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Create Issue
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    const issue = new Issue({
      title,
      description,
      category,
      location,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      userId: req.user._id,
      userName: req.user.name
    });

    await issue.save();
    res.status(201).json({ message: 'Issue reported successfully', issue });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get All Issues
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User's Issues
router.get('/my-issues', auth, async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Issue Status (Admin Only)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json({ message: 'Issue status updated', issue });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete Issue
router.delete('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if user owns the issue or is admin
    if (issue.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this issue' });
    }

    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;