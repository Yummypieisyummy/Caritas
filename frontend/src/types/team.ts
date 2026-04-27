import { Org, User } from './auth';

export type TeamResponse = {
  user: User;
  org: Org;
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  invitedAt: Date;
};

export type TeamInviteInput = {
  email: string;
  role: string;
};
