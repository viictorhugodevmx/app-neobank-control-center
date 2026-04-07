const mongoose = require('mongoose');
const Transfer = require('./transfer.model');
const Account = require('../accounts/account.model');

const generateTransferNumber = async () => {
  let transferNumber = '';
  let exists = true;

  while (exists) {
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    transferNumber = `TRX-${randomPart}`;
    const existing = await Transfer.findOne({ transferNumber });
    exists = Boolean(existing);
  }

  return transferNumber;
};

const createTransfer = async (req, res) => {
  try {
    const {
      originAccountId,
      destinationType = 'external',
      destinationAccount,
      destinationBank = '',
      beneficiaryName,
      amount,
      currency = 'MXN',
      concept = '',
      reference = '',
    } = req.body;

    if (!originAccountId || !destinationAccount || !beneficiaryName || !amount) {
      return res.status(400).json({
        success: false,
        message:
          'originAccountId, destinationAccount, beneficiaryName and amount are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(originAccountId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid originAccountId',
      });
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0',
      });
    }

    const account = await Account.findById(originAccountId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Origin account not found',
      });
    }

    if (account.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Transfers can only be created from an active account',
      });
    }

    if (account.currency !== currency) {
      return res.status(400).json({
        success: false,
        message: 'Transfer currency must match origin account currency',
      });
    }

    if (numericAmount > account.singleTransferLimit) {
      return res.status(400).json({
        success: false,
        message: 'Transfer amount exceeds single transfer limit',
      });
    }

    if (numericAmount > account.dailyTransferLimit) {
      return res.status(400).json({
        success: false,
        message: 'Transfer amount exceeds daily transfer limit',
      });
    }

    if (numericAmount > account.availableBalance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient available balance',
      });
    }

    const transferNumber = await generateTransferNumber();

    let riskFlag = 'none';
    if (numericAmount >= account.singleTransferLimit * 0.8) {
      riskFlag = 'medium';
    }
    if (numericAmount >= account.singleTransferLimit * 0.95) {
      riskFlag = 'high';
    }

    account.balance -= numericAmount;
    account.availableBalance -= numericAmount;
    await account.save();

    const transfer = await Transfer.create({
      transferNumber,
      originAccountId,
      destinationType,
      destinationAccount: destinationAccount.trim(),
      destinationBank: destinationBank.trim(),
      beneficiaryName: beneficiaryName.trim(),
      amount: numericAmount,
      currency,
      concept: concept.trim(),
      reference: reference.trim(),
      status: 'completed',
      riskFlag,
      failureReason: '',
      createdBy: req.user?.id || null,
      processedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Transfer created successfully',
      data: {
        transfer,
        originAccountBalance: {
          balance: account.balance,
          availableBalance: account.availableBalance,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating transfer',
      error: error.message,
    });
  }
};

const getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate('originAccountId', 'accountNumber clabe type currency status balance availableBalance')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Transfers fetched successfully',
      data: transfers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching transfers',
      error: error.message,
    });
  }
};

const getTransferById = async (req, res) => {
  try {
    const { id } = req.params;

    const transfer = await Transfer.findById(id)
      .populate('originAccountId', 'accountNumber clabe type currency status balance availableBalance')
      .populate('createdBy', 'firstName lastName email');

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transfer fetched successfully',
      data: transfer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching transfer',
      error: error.message,
    });
  }
};

module.exports = {
  createTransfer,
  getTransfers,
  getTransferById,
};