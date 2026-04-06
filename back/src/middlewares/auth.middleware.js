const jwt = require('jsonwebtoken');
const User = require('../modules/users/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required',
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.sub).populate(
      'roleId',
      'name key description permissions isActive'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });
    }

    if (!user.isActive || user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'User is not allowed to access the system',
      });
    }

    req.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      role: user.roleId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;