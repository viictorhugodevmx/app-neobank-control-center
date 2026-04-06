const Customer = require('./customer.model');

const generateCustomerNumber = () => {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `CUST-${randomPart}`;
};

const createCustomer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      phone,
      nationalId,
      taxId,
      address,
      occupation,
      monthlyIncome,
      sourceOfFunds,
      acceptedTerms,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !phone ||
      !nationalId ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message:
          'firstName, lastName, dateOfBirth, email, phone, nationalId and address are required',
      });
    }

    const existingCustomer = await Customer.findOne({
      $or: [{ email: email.toLowerCase() }, { nationalId: nationalId.trim() }],
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: 'A customer with the same email or nationalId already exists',
      });
    }

    const customer = await Customer.create({
      customerNumber: generateCustomerNumber(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      nationalId: nationalId.trim(),
      taxId: taxId ? taxId.trim() : '',
      address: address.trim(),
      occupation: occupation ? occupation.trim() : '',
      monthlyIncome: monthlyIncome || 0,
      sourceOfFunds: sourceOfFunds ? sourceOfFunds.trim() : '',
      acceptedTerms: Boolean(acceptedTerms),
      createdBy: req.user?.id || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: error.message,
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Customers fetched successfully',
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message,
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id).populate(
      'createdBy',
      'firstName lastName email'
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Customer fetched successfully',
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: error.message,
    });
  }
};

const updateOnboardingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { onboardingStatus } = req.body;

    const allowedStatuses = [
      'draft',
      'submitted',
      'in_review',
      'approved',
      'rejected',
    ];

    if (!allowedStatuses.includes(onboardingStatus)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid onboardingStatus. Allowed values: draft, submitted, in_review, approved, rejected',
      });
    }

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    customer.onboardingStatus = onboardingStatus;
    await customer.save();

    return res.status(200).json({
      success: true,
      message: 'Customer onboarding status updated successfully',
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating onboarding status',
      error: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateOnboardingStatus,
};