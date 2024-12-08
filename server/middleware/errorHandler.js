const { ValidationError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Sequelize validation errors
  if (err instanceof ValidationError) {
    err.statusCode = 400;
    err.message = err.errors.map(e => e.message).join(', ');
  }

  // Handle Multer errors
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    err.statusCode = 400;
    err.message = 'Too many files uploaded';
  }

  // Send error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err,
      stack: err.stack,
    }),
  });
};

module.exports = { errorHandler };