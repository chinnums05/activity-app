const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const {
  createActivity,
  getActivities,
  getActivity,
  joinActivity,
  leaveActivity,
} = require('../controllers/activityController');

router.post('/', protect, upload.array('images', 3), createActivity);
router.get('/', protect, getActivities);
router.get('/:id', protect, getActivity);
router.post('/:id/join', protect, joinActivity);
router.post('/:id/leave', protect, leaveActivity);

module.exports = router;