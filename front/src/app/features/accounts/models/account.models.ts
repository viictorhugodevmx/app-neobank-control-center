export interface AccountCustomer {
  customerNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  onboardingStatus: string;
  kycStatus: string;
}

export interface AccountCreator {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AccountItem {
  _id: string;
  customerId: AccountCustomer;
  accountNumber: string;
  clabe: string;
  type: 'personal' | 'savings' | 'business_light';
  currency: 'MXN' | 'USD';
  balance: number;
  availableBalance: number;
  status: 'active' | 'frozen' | 'blocked' | 'closed';
  dailyTransferLimit: number;
  singleTransferLimit: number;
  monthlyDepositLimit: number;
  isPrimary: boolean;
  openedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: AccountCreator | null;
}

export interface AccountsApiResponse {
  success: boolean;
  message: string;
  data: AccountItem[];
}
