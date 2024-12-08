const Activity = require('../models/Activity');
const User = require('../models/User');
const { UserActivity } = require('../models/index');
const AppError = require('../utils/AppError');

// Async handler wrapper
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Helper to transform image paths to URLs
const transformImageUrls = (activity) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  if (activity.images) {
    activity.images = activity.images.map(image => 
      image.startsWith('http') ? image : `${baseUrl}/${image}`
    );
  }
  return activity;
};

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
const createActivity = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  
  if (!req.files || req.files.length < 3) {
    throw new AppError('Please upload at least 3 images', 400);
  }

  // Store relative paths
  const images = req.files.map(file => file.path);

  const activity = await Activity.create({
    title,
    description,
    images,
    createdBy: req.user.id,
  });

  // Transform image paths to URLs for response
  const activityWithUrls = transformImageUrls(activity.toJSON());

  res.status(201).json({
    status: 'success',
    data: activityWithUrls
  });
});

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.findAll({
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      },
      {
        model: User,
        as: 'participants',
        attributes: ['id', 'username'],
        through: { attributes: ['status', 'joinedAt'] }
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  // Transform image paths to URLs for each activity
  const activitiesWithUrls = activities.map(activity => 
    transformImageUrls(activity.toJSON())
  );

  res.json({
    status: 'success',
    results: activities.length,
    data: activitiesWithUrls
  });
});

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
const getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'username'],
      },
      {
        model: User,
        as: 'participants',
        attributes: ['id', 'username'],
        through: { attributes: [] },
      },
    ],
  });

  if (!activity) {
    throw new AppError('Activity not found', 404);
  }

  // Transform image paths to URLs for response
  const activityWithUrls = transformImageUrls(activity.toJSON());

  res.json({
    status: 'success',
    data: activityWithUrls
  });
});

// @desc    Join an activity
// @route   POST /api/activities/:id/join
// @access  Private
const joinActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }
    ]
  });

  if (!activity) {
    throw new AppError('Activity not found', 404);
  }

  if (activity.createdBy === req.user.id) {
    throw new AppError('You cannot join your own activity', 400);
  }

  await activity.addParticipant(req.user.id);

  // Get the updated activity with participants
  const updatedActivity = await Activity.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      },
      {
        model: User,
        as: 'participants',
        attributes: ['id', 'username'],
        through: { attributes: ['status', 'joinedAt'] }
      }
    ]
  });

  // Transform image paths to URLs for response
  const activityWithUrls = transformImageUrls(updatedActivity.toJSON());

  // Notify activity creator through socket
  const io = req.app.get('io');
  io.to(`user_${activity.createdBy}`).emit('activityJoinNotification', {
    activityId: activity.id,
    activityTitle: activity.title,
    userId: req.user.id,
    userName: req.user.username
  });

  // Broadcast activity update to all clients
  io.emit('activityUpdated', {
    activityId: activity.id,
    data: activityWithUrls
  });

  res.json({
    status: 'success',
    data: activityWithUrls
  });
});

// @desc    Leave an activity
// @route   POST /api/activities/:id/leave
// @access  Private
const leaveActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByPk(req.params.id);

  if (!activity) {
    throw new AppError('Activity not found', 404);
  }

  await activity.removeParticipant(req.user.id);

  res.json({
    status: 'success',
    message: 'Successfully left activity'
  });
});

module.exports = {
  createActivity,
  getActivities,
  getActivity,
  joinActivity,
  leaveActivity,
};