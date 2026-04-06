const express = require('express');
const { getUsers } = require('./users.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requirePermission = require('../../middlewares/requirePermission.middleware');

const router = express.Router();

router.get('/', authMiddleware, requirePermission('users.read'), getUsers);

module.exports = router;