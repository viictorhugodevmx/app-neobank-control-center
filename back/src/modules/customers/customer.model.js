const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customerNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    nationalId: {
      type: String,
      required: true,
      trim: true,
    },
    taxId: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    occupation: {
      type: String,
      default: '',
      trim: true,
    },
    monthlyIncome: {
      type: Number,
      default: 0,
      min: 0,
    },
    sourceOfFunds: {
      type: String,
      default: '',
      trim: true,
    },
    onboardingStatus: {
      type: String,
      enum: ['draft', 'submitted', 'in_review', 'approved', 'rejected'],
      default: 'draft',
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'needs_review', 'rejected'],
      default: 'pending',
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    acceptedTerms: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('Customer', customerSchema);