const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all messages
// @route   GET /api/chat
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.create({
      content,
      userId: req.user.id,
    });

    const messageWithUser = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
    });

    // Emit the message to all connected clients
    req.app.get('io').emit('message', messageWithUser);

    res.status(201).json(messageWithUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};