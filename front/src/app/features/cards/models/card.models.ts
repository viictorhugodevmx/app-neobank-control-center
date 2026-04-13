export interface CardCustomer {
  customerNumber: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CardAccount {
  accountNumber: string;
  clabe: string;
  type: string;
  currency: string;
  status: string;
}

export interface CardCreator {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CardItem {
  _id: string;
  customerId: CardCustomer;
  accountId: CardAccount;
  cardNumberMasked: string;
  type: 'debit_virtual' | 'debit_physical';
  brand: 'visa' | 'mastercard';
  status: 'pending_activation' | 'active' | 'frozen' | 'blocked' | 'expired';
  holderName: string;
  expirationMonth: number;
  expirationYear: number;
  dailyPurchaseLimit: number;
  dailyWithdrawalLimit: number;
  isVirtual: boolean;
  isContactlessEnabled: boolean;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: CardCreator | null;
}

export interface CardsApiResponse {
  success: boolean;
  message: string;
  data: CardItem[];
}
