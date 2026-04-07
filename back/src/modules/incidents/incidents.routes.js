const express = require('express');
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  assignIncident,
} = require('./incidents.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/requirePermission.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requirePermission('incidents.create'),
  createIncident
);

router.get(
  '/',
  authMiddleware,
  requirePermission('incidents.read'),
  getIncidents
);

router.get(
  '/:id',
  authMiddleware,
  requirePermission('incidents.read'),
  getIncidentById
);

router.patch(
  '/:id/status',
  authMiddleware,
  requirePermission('incidents.update'),
  updateIncidentStatus
);

router.patch(
  '/:id/assign',
  authMiddleware,
  requirePermission('incidents.update'),
  assignIncident
);

module.exports = router;