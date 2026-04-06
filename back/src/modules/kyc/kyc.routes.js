const express = require('express');
const {
  createKycDocument,
  getKycDocumentsByCustomer,
  updateKycDocumentStatus,
} = require('./kyc.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/requirePermission.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requirePermission('kyc.review'),
  createKycDocument
);

router.get(
  '/customer/:customerId',
  authMiddleware,
  requirePermission('kyc.read'),
  getKycDocumentsByCustomer
);

router.patch(
  '/:id/status',
  authMiddleware,
  requirePermission('kyc.review'),
  updateKycDocumentStatus
);

module.exports = router;