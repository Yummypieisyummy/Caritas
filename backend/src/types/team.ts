export type OrgUserRole = 'admin' | 'member';

export type InviteInput = {
  orgId: string;
  inviterId: string;
  email: string;
  role: OrgUserRole;
  inviterRole: string;
};
