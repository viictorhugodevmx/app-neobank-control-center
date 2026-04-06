const express = require('express');
const { getRoles } = require('./roles.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/requirePermission.middleware');

const router = express.Router();

router.get('/', authMiddleware, requirePermission('users.read'), getRoles);

module.exports = router;