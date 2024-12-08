const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    validate: {
      minImages(value) {
        if (!Array.isArray(value) || value.length < 3) {
          throw new Error('At least 3 images are required');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: null,
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['title'],
    },
    {
      fields: ['status'],
    }
  ]
});

module.exports = Activity;