import * as teamServices from '../services/team.service';

export const getTeamByOrgId = async (req, res) => {
  const orgId = req.user.org_id;

  const team = await teamServices.getTeamData(orgId);
  res.status(200).json(team);
};

export const addTeamMember = async (req, res) => {
  const orgId = req.user.org_id;
  const inviterId = req.user.user_id;
  const inviterRole = req.user.role;

  const { email, role } = req.body;
  const dbRole = role.toLowerCase();

  const invite = await teamServices.inviteTeamMember({
    orgId,
    inviterId,
    inviterRole,
    email,
    role: dbRole,
  });

  res.status(201).json(invite);
};
