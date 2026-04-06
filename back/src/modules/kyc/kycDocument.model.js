const mongoose = require('mongoose');

const kycDocumentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    documentType: {
      type: String,
      enum: ['national_id', 'proof_of_address', 'selfie', 'tax_document'],
      required: true,
    },
    documentNumber: {
      type: String,
      default: '',
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'needs_review'],
      default: 'pending',
    },
    reviewNotes: {
      type: String,
      default: '',
      trim: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    uploadedBy: {
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

module.exports = mongoose.model('KycDocument', kycDocumentSchema);