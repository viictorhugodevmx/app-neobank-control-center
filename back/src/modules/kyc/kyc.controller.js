const mongoose = require('mongoose');
const KycDocument = require('./kycDocument.model');
const Customer = require('../customers/customer.model');

const recalculateCustomerKycStatus = async (customerId) => {
  const documents = await KycDocument.find({ customerId });

  if (!documents.length) {
    await Customer.findByIdAndUpdate(customerId, { kycStatus: 'pending' });
    return 'pending';
  }

  const statuses = documents.map((doc) => doc.status);

  let nextStatus = 'pending';

  if (statuses.includes('rejected')) {
    nextStatus = 'rejected';
  } else if (statuses.includes('needs_review')) {
    nextStatus = 'needs_review';
  } else if (statuses.every((status) => status === 'verified')) {
    nextStatus = 'verified';
  } else {
    nextStatus = 'pending';
  }

  await Customer.findByIdAndUpdate(customerId, { kycStatus: nextStatus });

  return nextStatus;
};

const createKycDocument = async (req, res) => {
  try {
    const { customerId, documentType, documentNumber, fileName } = req.body;

    if (!customerId || !documentType || !fileName) {
      return res.status(400).json({
        success: false,
        message: 'customerId, documentType and fileName are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customerId',
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    const existingDocument = await KycDocument.findOne({
      customerId,
      documentType,
    });

    if (existingDocument) {
      return res.status(409).json({
        success: false,
        message: 'This customer already has a document of the same type',
      });
    }

    const document = await KycDocument.create({
      customerId,
      documentType,
      documentNumber: documentNumber ? documentNumber.trim() : '',
      fileName: fileName.trim(),
      uploadedBy: req.user?.id || null,
    });

    const nextKycStatus = await recalculateCustomerKycStatus(customerId);

    return res.status(201).json({
      success: true,
      message: 'KYC document created successfully',
      data: {
        document,
        customerKycStatus: nextKycStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating KYC document',
      error: error.message,
    });
  }
};

const getKycDocumentsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customerId',
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    const documents = await KycDocument.find({ customerId })
      .populate('uploadedBy', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'KYC documents fetched successfully',
      data: documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching KYC documents',
      error: error.message,
    });
  }
};

const updateKycDocumentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const allowedStatuses = ['pending', 'verified', 'rejected', 'needs_review'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid status. Allowed values: pending, verified, rejected, needs_review',
      });
    }

    const document = await KycDocument.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'KYC document not found',
      });
    }

    document.status = status;
    document.reviewNotes = reviewNotes ? reviewNotes.trim() : '';
    document.reviewedBy = req.user?.id || null;
    document.reviewedAt = new Date();

    await document.save();

    const nextKycStatus = await recalculateCustomerKycStatus(document.customerId);

    return res.status(200).json({
      success: true,
      message: 'KYC document status updated successfully',
      data: {
        document,
        customerKycStatus: nextKycStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating KYC document status',
      error: error.message,
    });
  }
};

module.exports = {
  createKycDocument,
  getKycDocumentsByCustomer,
  updateKycDocumentStatus,
};