const express = require('express');
const {
  createTransfer,
  getTransfers,
  getTransferById,
} = require('./transfers.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/requirePermission.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requirePermission('transfers.create'),
  createTransfer
);

router.get(
  '/',
  authMiddleware,
  requirePermission('transfers.read'),
  getTransfers
);

router.get(
  '/:id',
  authMiddleware,
  requirePermission('transfers.read'),
  getTransferById
);

module.exports = router;