const mongoose = require('mongoose');
const Account = require('./account.model');
const Customer = require('../customers/customer.model');

const generateAccountNumber = () => {
  const randomPart = Math.floor(10000000 + Math.random() * 90000000);
  return `ACC${randomPart}`;
};

const generateClabe = async () => {
  let clabe = '';
  let exists = true;

  while (exists) {
    clabe = `646${Math.floor(100000000000000 + Math.random() * 900000000000000)}`;
    const existing = await Account.findOne({ clabe });
    exists = Boolean(existing);
  }

  return clabe;
};

const createAccount = async (req, res) => {
  try {
    const {
      customerId,
      type = 'personal',
      currency = 'MXN',
      initialBalance = 0,
      dailyTransferLimit = 10000,
      singleTransferLimit = 5000,
      monthlyDepositLimit = 50000,
      isPrimary = true,
    } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'customerId is required',
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

    if (customer.onboardingStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Customer onboarding must be approved before creating an account',
      });
    }

    if (customer.kycStatus !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Customer KYC must be verified before creating an account',
      });
    }

    if (isPrimary) {
      const existingPrimary = await Account.findOne({
        customerId,
        isPrimary: true,
        status: { $ne: 'closed' },
      });

      if (existingPrimary) {
        return res.status(409).json({
          success: false,
          message: 'Customer already has an active primary account',
        });
      }
    }

    let accountNumber = '';
    let accountExists = true;

    while (accountExists) {
      accountNumber = generateAccountNumber();
      const existing = await Account.findOne({ accountNumber });
      accountExists = Boolean(existing);
    }

    const clabe = await generateClabe();

    const numericInitialBalance = Number(initialBalance) || 0;

    const account = await Account.create({
      customerId,
      accountNumber,
      clabe,
      type,
      currency,
      balance: numericInitialBalance,
      availableBalance: numericInitialBalance,
      status: 'active',
      dailyTransferLimit,
      singleTransferLimit,
      monthlyDepositLimit,
      isPrimary: Boolean(isPrimary),
      createdBy: req.user?.id || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message,
    });
  }
};

const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find()
      .populate('customerId', 'customerNumber firstName lastName email onboardingStatus kycStatus')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Accounts fetched successfully',
      data: accounts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching accounts',
      error: error.message,
    });
  }
};

const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findById(id)
      .populate('customerId', 'customerNumber firstName lastName email onboardingStatus kycStatus')
      .populate('createdBy', 'firstName lastName email');

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Account fetched successfully',
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching account',
      error: error.message,
    });
  }
};

const updateAccountStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['active', 'frozen', 'blocked', 'closed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: active, frozen, blocked, closed',
      });
    }

    const account = await Account.findById(id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    account.status = status;
    await account.save();

    return res.status(200).json({
      success: true,
      message: 'Account status updated successfully',
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating account status',
      error: error.message,
    });
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccountStatus,
};