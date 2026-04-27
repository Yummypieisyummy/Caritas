export type InviteInput = {
  orgId: string;
  inviterId: string;
  email: string;
  role: 'admin' | 'member';
  inviterRole: string;
};
