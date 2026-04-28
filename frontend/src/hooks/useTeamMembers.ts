import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as teamsServices from '../services/team.api';
import { TeamInviteInput, TeamResponse } from '../types/team';

const TEAM_QUERY_KEY = ['teamMembers'];

export const useTeamMembers = () => {
  const queryClient = useQueryClient();

  const teamQuery = useQuery<TeamResponse>({
    queryKey: TEAM_QUERY_KEY,
    queryFn: teamsServices.getTeamRequest,
  });

  const inviteMutation = useMutation({
    mutationFn: (data: TeamInviteInput) =>
      teamsServices.addTeamMemberRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (targetUserId: string) =>
      teamsServices.removeTeamMemberRequest(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY });
    },
  });

  const revokeInviteMutation = useMutation({
    mutationFn: (inviteId: string) =>
      teamsServices.revokeTeamInviteRequest(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_QUERY_KEY });
    },
  });

  return {
    teamQuery,
    inviteMutation,
    removeMemberMutation,
    revokeInviteMutation,
    teamMembers: teamQuery.data?.members ?? [],
    pendingInvites: teamQuery.data?.invites ?? [],
  };
};

export const useTeamMember = useTeamMembers;
