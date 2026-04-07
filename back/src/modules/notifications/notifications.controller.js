const Notification = require('./notification.model');

const createNotification = async (req, res) => {
  try {
    const {
      type,
      title,
      message = '',
      severity = 'info',
      module = 'notifications',
      relatedEntityType = 'other',
      relatedEntityId = '',
    } = req.body;

    if (!type || !title) {
      return res.status(400).json({
        success: false,
        message: 'type and title are required',
      });
    }

    const notification = await Notification.create({
      type: type.trim(),
      title: title.trim(),
      message: message.trim(),
      severity,
      module,
      relatedEntityType,
      relatedEntityId: relatedEntityId ? String(relatedEntityId).trim() : '',
      createdBy: req.user?.id || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message,
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message,
    });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id).populate(
      'createdBy',
      'firstName lastName email'
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification fetched successfully',
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching notification',
      error: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read successfully',
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message,
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
};