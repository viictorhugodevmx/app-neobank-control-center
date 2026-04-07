const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema(
  {
    transferNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    originAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    destinationType: {
      type: String,
      enum: ['internal', 'external'],
      default: 'external',
    },
    destinationAccount: {
      type: String,
      required: true,
      trim: true,
    },
    destinationBank: {
      type: String,
      default: '',
      trim: true,
    },
    beneficiaryName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    currency: {
      type: String,
      enum: ['MXN', 'USD'],
      default: 'MXN',
    },
    concept: {
      type: String,
      default: '',
      trim: true,
    },
    reference: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'flagged'],
      default: 'completed',
    },
    riskFlag: {
      type: String,
      enum: ['none', 'medium', 'high'],
      default: 'none',
    },
    failureReason: {
      type: String,
      default: '',
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Transfer', transferSchema);