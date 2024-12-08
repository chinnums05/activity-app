const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

const GENERAL_CHAT_ROOM = 'general'; // Default chat room ID

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    },
  });

  // Add authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      next(new Error('Invalid authentication'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id, 'User:', socket.user?.username);

    // Join user's personal room for notifications and the general chat room
    if (socket.user) {
      socket.join(`user_${socket.user.id}`);
      socket.join(GENERAL_CHAT_ROOM);
    }

    // Handle chat messages
    socket.on('chatMessage', async (messageData) => {
      try {
        // Create message in database
        const message = await Message.create({
          content: messageData.content,
          userId: socket.user.id,
          roomId: GENERAL_CHAT_ROOM,
          type: 'text',
          status: 'sent'
        });

        // Fetch the complete message with user details
        const completeMessage = await Message.findByPk(message.id, {
          include: [{
            model: User,
            attributes: ['id', 'username']
          }]
        });

        // Broadcast the message to all users in the chat room
        io.to(GENERAL_CHAT_ROOM).emit('newMessage', completeMessage);
      } catch (error) {
        console.error('Error handling chat message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle fetching chat history
    socket.on('fetchChatHistory', async () => {
      try {
        const messages = await Message.findAll({
          where: {
            roomId: GENERAL_CHAT_ROOM
          },
          include: [{
            model: User,
            attributes: ['id', 'username']
          }],
          order: [['createdAt', 'DESC']],
          limit: 50 // Limit to last 50 messages
        });

        socket.emit('chatHistory', messages.reverse());
      } catch (error) {
        console.error('Error fetching chat history:', error);
        socket.emit('error', { message: 'Failed to fetch chat history' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

module.exports = setupSocket;