export interface LoginFormValue {
  email: string;
  password: string;
}

export interface AuthRole {
  name: string;
  key: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  isActive: boolean;
  lastLoginAt: string | null;
  role: AuthRole;
}

export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}
