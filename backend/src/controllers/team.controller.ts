import { Request, Response } from 'express';
import * as teamServices from '../services/team.service';
import { AuthPayload } from '../types/auth';
import { OrgUserRole } from '../types/team';

const getAuthUser = (req: Request) =>
  (req as Request & { user: AuthPayload }).user;

export const getTeamByOrgId = async (req: Request, res: Response) => {
  const orgId = getAuthUser(req).org_id;
  const team = await teamServices.getTeamData(orgId);

  res.status(200).json(team);
};

export const addTeamMember = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const orgId = user.org_id;
  const inviterId = user.user_id;
  const inviterRole = user.role;

  const { email, role } = req.body;
  const dbRole = String(role || '').toLowerCase() as OrgUserRole;

  const invite = await teamServices.inviteMember({
    orgId,
    inviterId,
    inviterRole,
    email,
    role: dbRole,
  });

  res.status(201).json(invite);
};

export const removeTeamMember = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { targetUserId } = req.params as { targetUserId: string };

  await teamServices.removeMember(user.org_id, user.user_id, targetUserId);

  res.status(204).send();
};

export const revokeInvite = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { inviteId } = req.params as { inviteId: string };

  await teamServices.revokeInvite(user.org_id, inviteId);

  res.status(204).send();
};
