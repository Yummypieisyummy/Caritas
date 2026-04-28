export type RegisterInput = {
  email: string;
  password: string;
  orgName: string;
  turnstileToken: string;
};

export type LoginInput = {
  email: string;
  password: string;
  // turnstileToken: string;
};

export type User = {
  id: string;
  email: string;
};

export type Org = {
  id: string;
  name: string;
  verified: boolean;
  pfp_url?: string | null;
  banner_url?: string | null;
  about?: string | null;
  email?: string | null;
  contact_info?: {
    phone?: string | null;
    public_email?: string | null;
    email?: string | null;
    website?: string | null;
    address?: string | null;
    hours?: string | null;
  } | null;
};

export type RegisterResponse = {
  user: User;
  org: Org;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
  org: Org;
};
