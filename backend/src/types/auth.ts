export interface AuthPayload {
  user_id: string;
  org_id: string;
  role: string;
  orgVerified: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  orgName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
