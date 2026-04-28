import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as orgApi from '../services/org.api';
import { UpdateOrgProfilePayload } from '../services/org.api';

type UseOrgSettingsOptions = {
  orgId?: string;
  onDeleteSuccess: () => Promise<void> | void;
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const useOrgSettings = ({
  orgId,
  onDeleteSuccess,
}: UseOrgSettingsOptions) => {
  const queryClient = useQueryClient();

  const requireOrgId = () => {
    if (!orgId) {
      throw new Error('Organization ID not found. Please log in again.');
    }

    return orgId;
  };

  const exportMutation = useMutation({
    mutationFn: async () => {
      const activeOrgId = requireOrgId();
      const blob = await orgApi.exportOrganizationDataRequest(activeOrgId);
      downloadBlob(blob, `organization_${activeOrgId}_export.json`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await orgApi.deleteOrganizationRequest(requireOrgId());
    },
    onSuccess: async () => {
      queryClient.clear();
      await onDeleteSuccess();
    },
  });

  return {
    exportOrganizationData: exportMutation.mutateAsync,
    isExporting: exportMutation.isPending,
    exportError: exportMutation.error,
    deleteOrganization: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export const useUpdateOrgProfile = (orgId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateOrgProfilePayload) => {
      if (!orgId) {
        throw new Error('Organization ID not found. Please log in again.');
      }

      return orgApi.updateOrgProfileRequest(orgId, data);
    },
    onSuccess: (updatedOrg) => {
      queryClient.setQueryData(['orgProfile', orgId], (current: unknown) => {
        if (
          current &&
          typeof current === 'object' &&
          'organization' in current
        ) {
          return {
            ...current,
            organization: updatedOrg,
          };
        }

        return current;
      });
      queryClient.setQueryData(['authUser'], (current: unknown) => {
        if (current && typeof current === 'object' && 'org' in current) {
          return {
            ...current,
            org: updatedOrg,
          };
        }

        return current;
      });
      queryClient.invalidateQueries({ queryKey: ['orgProfile', orgId] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
};
