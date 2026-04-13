export interface DashboardBreakdownItem {
  _id: string;
  count: number;
}

export interface DashboardTransferItem {
  _id: string;
  transferNumber: string;
  destinationAccount: string;
  beneficiaryName: string;
  amount: number;
  currency: string;
  status: string;
  riskFlag: string;
  createdAt: string;
  originAccountId?: {
    accountNumber: string;
    currency: string;
  };
}

export interface DashboardIncidentItem {
  _id: string;
  incidentNumber: string;
  type: string;
  title: string;
  priority: string;
  status: string;
  createdAt: string;
  assignedTo?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface DashboardNotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  severity: string;
  module: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  totals: {
    customers: number;
    accounts: number;
    cards: number;
    transfers: number;
    incidents: number;
    unreadNotifications: number;
  };
  breakdowns: {
    customersByOnboarding: DashboardBreakdownItem[];
    customersByKyc: DashboardBreakdownItem[];
    accountsByStatus: DashboardBreakdownItem[];
    cardsByStatus: DashboardBreakdownItem[];
    incidentsByStatus: DashboardBreakdownItem[];
  };
  latest: {
    transfers: DashboardTransferItem[];
    incidents: DashboardIncidentItem[];
    notifications: DashboardNotificationItem[];
  };
}

export interface DashboardSummaryApiResponse {
  success: boolean;
  message: string;
  data: DashboardSummary;
}
