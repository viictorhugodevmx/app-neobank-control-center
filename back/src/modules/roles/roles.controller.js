const Role = require('./role.model');

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: 'Roles fetched successfully',
      data: roles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message,
    });
  }
};

module.exports = {
  getRoles,
};