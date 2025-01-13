const express = require('express');
const multer = require('multer');
const Video = require('../models/video'); // Ensure the path is correct
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Upload a video
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const newVideo = new Video({
      title: req.body.title,
      videoPath: req.file.path,
    });
    await newVideo.save();
    res.status(201).json({ message: 'Video uploaded', video: newVideo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      // Delete the video from the filesystem
      const fs = require('fs');
      fs.unlinkSync(video.videoPath);
  
      // Remove from MongoDB
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete video' });
    }
  });
  

// Like a video
router.post('/:id/like', async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      video.likes = (video.likes || 0) + 1; // Increment likes
      await video.save();
  
      res.status(200).json({ message: 'Video liked', likes: video.likes });
    } catch (error) {
      res.status(500).json({ message: 'Failed to like video', error });
    }
  });

  
  // Add a comment to a video
router.post('/:id/comment', async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      const { comment } = req.body;
      if (!comment || comment.trim() === '') {
        return res.status(400).json({ message: 'Comment cannot be empty' });
      }
  
      video.comments = [...(video.comments || []), comment]; // Add the comment
      await video.save();
  
      res.status(200).json({ message: 'Comment added', comments: video.comments });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add comment', error });
    }
  });
  

module.exports = router;
