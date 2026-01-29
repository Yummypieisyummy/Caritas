export type RegisterInput = {
  email: string;
  password: string;
  orgName: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
};

export type Org = {
  id: string;
  name: string;
  verified: boolean;
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
