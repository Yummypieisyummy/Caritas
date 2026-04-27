import api from './axios';
import { Org } from '../types/auth';

export const getOrgDataRequest = async (): Promise<Org> => {
  try {
    const res = await api.get<Org>('/organizations');
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const deleteOrganizationRequest = async (
  orgId: string,
): Promise<void> => {
  try {
    await api.delete(`/organizations/${orgId}`);
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const exportOrganizationDataRequest = async (
  orgId: string,
): Promise<Blob> => {
  try {
    const res = await api.get(`/organizations/${orgId}/export`, {
      responseType: 'blob',
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const submitOrganizationVerificationRequest = async (
  orgId: string,
  documents: unknown,
) => {
  try {
    const res = await api.post(`/organizations/${orgId}/verification`, {
      documents,
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};
