const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    clabe: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['personal', 'savings', 'business_light'],
      default: 'personal',
    },
    currency: {
      type: String,
      enum: ['MXN', 'USD'],
      default: 'MXN',
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'frozen', 'blocked', 'closed'],
      default: 'active',
    },
    dailyTransferLimit: {
      type: Number,
      default: 10000,
      min: 0,
    },
    singleTransferLimit: {
      type: Number,
      default: 5000,
      min: 0,
    },
    monthlyDepositLimit: {
      type: Number,
      default: 50000,
      min: 0,
    },
    isPrimary: {
      type: Boolean,
      default: true,
    },
    openedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Account', accountSchema);