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

export async function updateAdminProfile(userId: string, payload: AdminProfileUpdate) {
  // The API only exposes `PATCH /user/:id`; `/user/admin` is not a route.
  const response = await axiosInstance.patch(`/user/${userId}`, payload);
  return response.data?.data ?? response.data;
}
