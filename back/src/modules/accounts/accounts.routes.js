const express = require('express');
const {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccountStatus,
} = require('./accounts.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/requirePermission.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requirePermission('accounts.create'),
  createAccount
);

router.get(
  '/',
  authMiddleware,
  requirePermission('accounts.read'),
  getAccounts
);

router.get(
  '/:id',
  authMiddleware,
  requirePermission('accounts.read'),
  getAccountById
);

router.patch(
  '/:id/status',
  authMiddleware,
  requirePermission('accounts.update'),
  updateAccountStatus
);

module.exports = router;