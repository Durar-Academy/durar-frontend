import { axiosInstance } from "@/lib/axios";

export async function getCurrentUser(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/user/me", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function changePassword(payload: { password: string }) {
  const response = await axiosInstance.post("/auth/change-password", payload);
  return response.data;
}

export async function inviteTutor(payload: { email: string }) {
  const response = await axiosInstance.post(`/user/invite-tutor`, payload);
  return response.data;
}
