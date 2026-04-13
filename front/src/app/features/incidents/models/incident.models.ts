export interface IncidentAssignedUser {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

export interface IncidentCreatedBy {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IncidentItem {
  _id: string;
  incidentNumber: string;
  type:
    | 'kyc_rejected'
    | 'transfer_failed'
    | 'transfer_flagged'
    | 'card_blocked'
    | 'account_frozen'
    | 'suspicious_login'
    | 'limit_exceeded'
    | 'manual_review';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  relatedEntityType: 'customer' | 'account' | 'card' | 'transfer' | 'auth' | 'other';
  relatedEntityId: string;
  assignedTo?: IncidentAssignedUser | null;
  createdBy?: IncidentCreatedBy | null;
  resolutionNotes: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentsApiResponse {
  success: boolean;
  message: string;
  data: IncidentItem[];
}
