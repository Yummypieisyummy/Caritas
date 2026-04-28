import api from './axios';
import { TeamInviteInput, TeamResponse } from '../types/team';

export const getTeamRequest = async () => {
  const res = await api.get<TeamResponse>('/team');
  return res.data;
};

export const addTeamMemberRequest = async (input: TeamInviteInput) => {
  const res = await api.post('/team/invite', input);
  return res.data;
};

export const removeTeamMemberRequest = async (targetUserId: string) => {
  await api.delete(`/team/members/${targetUserId}`);
};

export const revokeTeamInviteRequest = async (inviteId: string) => {
  await api.delete(`/team/invites/${inviteId}`);
};
