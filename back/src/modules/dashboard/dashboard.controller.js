const Customer = require('../customers/customer.model');
const Account = require('../accounts/account.model');
const Card = require('../cards/card.model');
const Transfer = require('../transfers/transfer.model');
const Incident = require('../incidents/incident.model');
const Notification = require('../notifications/notification.model');

const getDashboardSummary = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalAccounts,
      totalCards,
      totalTransfers,
      totalIncidents,
      unreadNotifications,
      customersByOnboarding,
      customersByKyc,
      accountsByStatus,
      cardsByStatus,
      incidentsByStatus,
      latestTransfers,
      latestIncidents,
      latestNotifications,
    ] = await Promise.all([
      Customer.countDocuments(),
      Account.countDocuments(),
      Card.countDocuments(),
      Transfer.countDocuments(),
      Incident.countDocuments(),
      Notification.countDocuments({ isRead: false }),

      Customer.aggregate([
        {
          $group: {
            _id: '$onboardingStatus',
            count: { $sum: 1 },
          },
        },
      ]),

      Customer.aggregate([
        {
          $group: {
            _id: '$kycStatus',
            count: { $sum: 1 },
          },
        },
      ]),

      Account.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),

      Card.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),

      Incident.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),

      Transfer.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('originAccountId', 'accountNumber currency'),

      Incident.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('assignedTo', 'firstName lastName email'),

      Notification.find()
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Dashboard summary fetched successfully',
      data: {
        totals: {
          customers: totalCustomers,
          accounts: totalAccounts,
          cards: totalCards,
          transfers: totalTransfers,
          incidents: totalIncidents,
          unreadNotifications,
        },
        breakdowns: {
          customersByOnboarding,
          customersByKyc,
          accountsByStatus,
          cardsByStatus,
          incidentsByStatus,
        },
        latest: {
          transfers: latestTransfers,
          incidents: latestIncidents,
          notifications: latestNotifications,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};