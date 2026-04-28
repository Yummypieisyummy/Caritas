import { useQuery } from '@tanstack/react-query';
import api from '../services/axios';
import { Org } from '../types/auth';
import { PostResponse } from '../types/posts';

export type OrgContactInfo = {
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  hours?: string | null;
};

export type OrgProfile = Org & {
  email?: string | null;
  contact_info?: OrgContactInfo | null;
  created_at?: string;
  updated_at?: string;
};

export type OrgProfileResponse = {
  organization: OrgProfile;
  activePosts: PostResponse[];
};

const getOrgProfileRequest = async (orgId: string) => {
  const res = await api.get<OrgProfileResponse>(`/orgs/${orgId}`);
  return res.data;
};

export const useOrgProfile = (orgId?: string) => {
  return useQuery({
    queryKey: ['orgProfile', orgId],
    queryFn: () => getOrgProfileRequest(orgId as string),
    enabled: Boolean(orgId),
    staleTime: 10 * 60 * 1000,
  });
};
