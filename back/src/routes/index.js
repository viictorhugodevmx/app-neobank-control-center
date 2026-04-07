const express = require('express');
const rolesRoutes = require('../modules/roles/roles.routes');
const usersRoutes = require('../modules/users/users.routes');
const authRoutes = require('../modules/auth/auth.routes');
const customersRoutes = require('../modules/customers/customers.routes');
const kycRoutes = require('../modules/kyc/kyc.routes');
const accountsRoutes = require('../modules/accounts/accounts.routes');
const cardsRoutes = require('../modules/cards/cards.routes');
const transfersRoutes = require('../modules/transfers/transfers.routes');
const incidentsRoutes = require('../modules/incidents/incidents.routes');
const notificationsRoutes = require('../modules/notifications/notifications.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');

const router = express.Router();

router.use('/roles', rolesRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/customers', customersRoutes);
router.use('/kyc', kycRoutes);
router.use('/accounts', accountsRoutes);
router.use('/cards', cardsRoutes);
router.use('/transfers', transfersRoutes);
router.use('/incidents', incidentsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;