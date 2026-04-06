const bcrypt = require('bcryptjs');
const Role = require('../roles/role.model');
const User = require('../users/user.model');

const defaultRoles = [
  {
    name: 'Super Admin',
    key: 'super_admin',
    description: 'Full system access',
    permissions: ['*'],
  },
  {
    name: 'Operations Admin',
    key: 'operations_admin',
    description: 'Operational management access',
    permissions: [
      'users.read',
      'customers.read',
      'customers.update',
      'kyc.read',
      'kyc.review',
      'accounts.read',
      'accounts.create',
      'accounts.update',
      'cards.read',
      'cards.create',
      'cards.update',
      'transfers.read',
      'transfers.create',
      'transfers.update',
      'incidents.read',
      'incidents.create',
      'incidents.update',
    ],
  },
  {
    name: 'Compliance Analyst',
    key: 'compliance_analyst',
    description: 'Compliance and KYC review access',
    permissions: [
      'customers.read',
      'kyc.read',
      'kyc.review',
      'transfers.read',
      'transfers.flag',
      'incidents.read',
      'incidents.create',
      'incidents.update',
    ],
  },
  {
    name: 'Support Agent',
    key: 'support_agent',
    description: 'Customer support operational access',
    permissions: [
      'customers.read',
      'accounts.read',
      'cards.read',
      'cards.update',
      'transfers.read',
      'incidents.read',
      'incidents.create',
      'incidents.update',
    ],
  },
  {
    name: 'Viewer',
    key: 'viewer',
    description: 'Read-only access',
    permissions: [
      'customers.read',
      'accounts.read',
      'cards.read',
      'transfers.read',
      'incidents.read',
    ],
  },
];

const seedInitialData = async () => {
  for (const role of defaultRoles) {
    await Role.findOneAndUpdate(
      { key: role.key },
      {
        $set: {
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          isActive: true,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
  }

  console.log('✅ Roles seed synced');

  const existingAdmin = await User.findOne({ email: 'admin@neobank.local' });

  if (!existingAdmin) {
    const superAdminRole = await Role.findOne({ key: 'super_admin' });

    if (!superAdminRole) {
      throw new Error('Super Admin role not found during seed');
    }

    const passwordHash = await bcrypt.hash('Admin123*', 10);

    await User.create({
      firstName: 'NeoBank',
      lastName: 'Admin',
      email: 'admin@neobank.local',
      passwordHash,
      roleId: superAdminRole._id,
      status: 'active',
      isActive: true,
    });

    console.log('✅ Initial admin user seeded');
  } else {
    console.log('ℹ️ Admin user already exists, skipping admin seed');
  }
};

module.exports = seedInitialData;