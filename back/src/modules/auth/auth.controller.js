const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../users/user.model');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate(
      'roleId',
      'name key description permissions isActive'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive || user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'User is not allowed to access the system',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const tokenPayload = {
      sub: user._id,
      email: user.email,
      role: user.roleId?.key || null,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });

    user.lastLoginAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: user.status,
          isActive: user.isActive,
          lastLoginAt: user.lastLoginAt,
          role: user.roleId,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    });
  }
};

const me = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Authenticated user fetched successfully',
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching authenticated user',
      error: error.message,
    });
  }
};

module.exports = {
  login,
  me,
};