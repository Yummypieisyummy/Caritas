import api from './axios';
import { Org } from '../types/auth';

export const getOrgDataRequest = async (): Promise<Org> => {
  try {
    const res = await api.get<Org>('/');
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};
