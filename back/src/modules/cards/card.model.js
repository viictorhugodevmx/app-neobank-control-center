const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    cardNumberMasked: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['debit_virtual', 'debit_physical'],
      default: 'debit_virtual',
    },
    brand: {
      type: String,
      enum: ['visa', 'mastercard'],
      default: 'visa',
    },
    status: {
      type: String,
      enum: ['pending_activation', 'active', 'frozen', 'blocked', 'expired'],
      default: 'pending_activation',
    },
    holderName: {
      type: String,
      required: true,
      trim: true,
    },
    expirationMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    expirationYear: {
      type: Number,
      required: true,
    },
    dailyPurchaseLimit: {
      type: Number,
      default: 10000,
      min: 0,
    },
    dailyWithdrawalLimit: {
      type: Number,
      default: 5000,
      min: 0,
    },
    isVirtual: {
      type: Boolean,
      default: true,
    },
    isContactlessEnabled: {
      type: Boolean,
      default: true,
    },
    issuedAt: {
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

module.exports = mongoose.model('Card', cardSchema);