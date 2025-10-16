export interface UserPayload {
  sub: number;
  role_id: string;
  company_id: string;
  branch_id: string;
}

export interface DeviceInfo {
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface UserCompanyInfo {
  company_id: string;
  branch_id: string;
  role_id: string;
  role_name: string;
}

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    image: string | null;
    company: UserCompanyInfo;
    companies: UserCompanyInfo[];
  };
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  message: string;
}

export interface TwoFactorLoginResponse {
  requires2FA: true;
  userId: number;
  message: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  image?: string;
  company_id?: string;
  branch_id?: string;
}

export interface GoogleUserData {
  email: string;
  name: string;
  image?: string;
}

export interface EmailLoginCredentials {
  email: string;
  password: string;
}

export interface TwoFactorCredentials {
  userId: number;
  otpCode: string;
}
