import api from './axios';
import { TeamInviteInput, TeamResponse } from '../types/team';

export const getTeamRequest = async () => {
  const res = await api.get<TeamResponse[]>('/team');
  return res.data;
};

export const addTeamMemberRequest = async (input: TeamInviteInput) => {
  const res = await api.post('/team/invite', input);
  console.log('team addition invite data', res.data);
  return res.data;
};
