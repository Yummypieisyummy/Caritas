export type TeamRole = 'admin' | 'member';

export type TeamMember = {
  id: string;
  email: string;
  role: TeamRole;
  status: 'active';
  emailVerifiedAt: string | null;
  createdAt: string;
};

export type PendingInvite = {
  id: string;
  email: string;
  role: TeamRole;
  status: 'pending';
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
};

export type TeamResponse = {
  members: TeamMember[];
  invites: PendingInvite[];
};

export type TeamInviteInput = {
  email: string;
  role: TeamRole;
};
