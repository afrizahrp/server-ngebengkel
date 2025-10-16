export interface AuthenticatedUser {
  id: number;
  role_id: string;
  company_id: string;
  branch_id: string;
}

export interface AuthRequest {
  user: AuthenticatedUser;
  refreshToken?: string;
  sessionId?: string;
}

