import { TeamInviteInput, TeamResponse } from '../types/team';
import * as teamsServices from '../services/team.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useTeamMember = () => {
  const queryClient = useQueryClient();

  const { data: teamMembers = [], status } = useQuery<TeamResponse[]>({
    queryKey: ['teamMembers'],
    queryFn: teamsServices.getTeamRequest,
  });

  const createMutation = useMutation({
    mutationFn: (data: TeamInviteInput) =>
      teamsServices.addTeamMemberRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
    },
  });

  return {
    status,
    teamMembers,
    addTeamMember: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};
