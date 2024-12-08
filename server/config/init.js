const fs = require('fs');
const path = require('path');

const initializeServer = () => {
  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
};

module.exports = initializeServer;