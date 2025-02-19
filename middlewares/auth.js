const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication failed. Token not provided.'
      });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by email from token
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({
        message: 'Authentication failed. User not found.'
      });
    }

    req.user = user; // Attach the user object to the request

    next();
  }
  catch (error) {
      if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({
            message: 'Authentication failed. Invalid token.'
          });
      }
    res.status(500).json({
      message: error.message
    });
  }
};

// Authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.type)) {
      return res.status(403).json({
        message: 'Unauthorized'
      });
    }
    
    next();
  };
};

module.exports = { authenticate, authorize };