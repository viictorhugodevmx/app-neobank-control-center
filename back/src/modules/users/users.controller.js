const User = require('./user.model');

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate('roleId', 'name key description permissions isActive')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
};