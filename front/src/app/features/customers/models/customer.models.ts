export interface CustomerCreator {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CustomerItem {
  _id: string;
  customerNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  nationalId: string;
  taxId: string;
  address: string;
  occupation: string;
  monthlyIncome: number;
  sourceOfFunds: string;
  onboardingStatus: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected';
  kycStatus: 'pending' | 'verified' | 'needs_review' | 'rejected';
  riskLevel: 'low' | 'medium' | 'high';
  acceptedTerms: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: CustomerCreator | null;
}

export interface CustomersApiResponse {
  success: boolean;
  message: string;
  data: CustomerItem[];
}

export interface CustomerDetailApiResponse {
  success: boolean;
  message: string;
  data: CustomerItem;
}
