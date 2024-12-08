const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  type: {
    type: DataTypes.ENUM('text', 'system', 'notification'),
    defaultValue: 'text'
  },
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Can be activityId for activity-specific chat or "general" for main chat'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read'),
    defaultValue: 'sent'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['roomId'],
    },
    {
      fields: ['userId'],
    }
  ]
});

module.exports = Message;