const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Activity = require('./Activity');
const Message = require('./Message');

// User-Activity relationships (for created activities)
User.hasMany(Activity, { 
  foreignKey: 'createdBy',
  onDelete: 'CASCADE'
});
Activity.belongsTo(User, { 
  foreignKey: 'createdBy',
  as: 'creator' 
});

// User-Activity (participants) relationships
const UserActivity = sequelize.define('UserActivity', {
  status: {
    type: DataTypes.ENUM('joined', 'left'),
    defaultValue: 'joined'
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

User.belongsToMany(Activity, { 
  through: UserActivity,
  as: 'participatingActivities'
});
Activity.belongsToMany(User, { 
  through: UserActivity,
  as: 'participants'
});

// User-Message relationships
User.hasMany(Message, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Message.belongsTo(User, {
  foreignKey: 'userId'
});

module.exports = {
  User,
  Activity,
  Message,
  UserActivity,
};