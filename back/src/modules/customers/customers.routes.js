const express = require('express');
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateOnboardingStatus,
} = require('./customers.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/requirePermission.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requirePermission('customers.update'),
  createCustomer
);

router.get(
  '/',
  authMiddleware,
  requirePermission('customers.read'),
  getCustomers
);

router.get(
  '/:id',
  authMiddleware,
  requirePermission('customers.read'),
  getCustomerById
);

router.patch(
  '/:id/onboarding-status',
  authMiddleware,
  requirePermission('customers.update'),
  updateOnboardingStatus
);

module.exports = router;