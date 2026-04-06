const mongoose = require('mongoose');
const Card = require('./card.model');
const Account = require('../accounts/account.model');
const Customer = require('../customers/customer.model');

const generateMaskedCardNumber = async () => {
  let cardNumberMasked = '';
  let exists = true;

  while (exists) {
    const lastFour = Math.floor(1000 + Math.random() * 9000);
    cardNumberMasked = `**** **** **** ${lastFour}`;
    const existing = await Card.findOne({ cardNumberMasked });
    exists = Boolean(existing);
  }

  return cardNumberMasked;
};

const createCard = async (req, res) => {
  try {
    const {
      accountId,
      type = 'debit_virtual',
      brand = 'visa',
      dailyPurchaseLimit = 10000,
      dailyWithdrawalLimit = 5000,
      isContactlessEnabled = true,
    } = req.body;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: 'accountId is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid accountId',
      });
    }

    const account = await Account.findById(accountId).populate('customerId');

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    if (account.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Card can only be created for an active account',
      });
    }

    const customer = await Customer.findById(account.customerId?._id || account.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found for this account',
      });
    }

    const holderName = `${customer.firstName} ${customer.lastName}`.trim();
    const now = new Date();
    const expirationMonth = now.getMonth() + 1;
    const expirationYear = now.getFullYear() + 4;
    const cardNumberMasked = await generateMaskedCardNumber();

    const card = await Card.create({
      customerId: customer._id,
      accountId: account._id,
      cardNumberMasked,
      type,
      brand,
      status: 'pending_activation',
      holderName,
      expirationMonth,
      expirationYear,
      dailyPurchaseLimit,
      dailyWithdrawalLimit,
      isVirtual: type === 'debit_virtual',
      isContactlessEnabled: Boolean(isContactlessEnabled),
      createdBy: req.user?.id || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Card created successfully',
      data: card,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating card',
      error: error.message,
    });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find()
      .populate('customerId', 'customerNumber firstName lastName email')
      .populate('accountId', 'accountNumber clabe type currency status')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Cards fetched successfully',
      data: cards,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching cards',
      error: error.message,
    });
  }
};

const getCardById = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findById(id)
      .populate('customerId', 'customerNumber firstName lastName email')
      .populate('accountId', 'accountNumber clabe type currency status')
      .populate('createdBy', 'firstName lastName email');

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Card fetched successfully',
      data: card,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching card',
      error: error.message,
    });
  }
};

const updateCardStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      'pending_activation',
      'active',
      'frozen',
      'blocked',
      'expired',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid status. Allowed values: pending_activation, active, frozen, blocked, expired',
      });
    }

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found',
      });
    }

    card.status = status;
    await card.save();

    return res.status(200).json({
      success: true,
      message: 'Card status updated successfully',
      data: card,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating card status',
      error: error.message,
    });
  }
};

module.exports = {
  createCard,
  getCards,
  getCardById,
  updateCardStatus,
};