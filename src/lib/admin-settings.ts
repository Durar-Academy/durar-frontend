import { axiosInstance } from './axios';

export type AdminProfileUpdate = {
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  phone?: string;
  country?: string;
};

export async function updateAdminProfile(payload: AdminProfileUpdate) {
  const response = await axiosInstance.patch('/user/admin', payload);
  return response.data?.data ?? response.data;
}
