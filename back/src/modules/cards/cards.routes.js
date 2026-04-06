const express = require('express');
const {
  createCard,
  getCards,
  getCardById,
  updateCardStatus,
} = require('./cards.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/requirePermission.middleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requirePermission('cards.create'),
  createCard
);

router.get(
  '/',
  authMiddleware,
  requirePermission('cards.read'),
  getCards
);

router.get(
  '/:id',
  authMiddleware,
  requirePermission('cards.read'),
  getCardById
);

router.patch(
  '/:id/status',
  authMiddleware,
  requirePermission('cards.update'),
  updateCardStatus
);

module.exports = router;