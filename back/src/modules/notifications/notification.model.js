const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    module: {
      type: String,
      enum: [
        'auth',
        'customers',
        'kyc',
        'accounts',
        'cards',
        'transfers',
        'incidents',
        'notifications',
      ],
      default: 'notifications',
    },
    relatedEntityType: {
      type: String,
      enum: ['customer', 'account', 'card', 'transfer', 'incident', 'auth', 'other'],
      default: 'other',
    },
    relatedEntityId: {
      type: String,
      default: '',
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);