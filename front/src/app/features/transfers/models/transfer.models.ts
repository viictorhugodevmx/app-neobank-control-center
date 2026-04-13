export interface TransferOriginAccount {
  accountNumber: string;
  clabe: string;
  type: string;
  currency: string;
  status: string;
  balance: number;
  availableBalance: number;
}

export interface TransferCreator {
  firstName: string;
  lastName: string;
  email: string;
}

export interface TransferItem {
  _id: string;
  transferNumber: string;
  originAccountId: TransferOriginAccount;
  destinationType: 'internal' | 'external';
  destinationAccount: string;
  destinationBank: string;
  beneficiaryName: string;
  amount: number;
  currency: 'MXN' | 'USD';
  concept: string;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'flagged';
  riskFlag: 'none' | 'medium' | 'high';
  failureReason: string;
  createdBy?: TransferCreator | null;
  processedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransfersApiResponse {
  success: boolean;
  message: string;
  data: TransferItem[];
}
