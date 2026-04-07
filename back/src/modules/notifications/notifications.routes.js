const express = require('express');
const {
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
} = require('./notifications.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/requirePermission.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requirePermission('incidents.create'),
  createNotification
);

router.get(
  '/',
  authMiddleware,
  requirePermission('incidents.read'),
  getNotifications
);

router.get(
  '/:id',
  authMiddleware,
  requirePermission('incidents.read'),
  getNotificationById
);

router.patch(
  '/:id/read',
  authMiddleware,
  requirePermission('incidents.update'),
  markNotificationAsRead
);

module.exports = router;