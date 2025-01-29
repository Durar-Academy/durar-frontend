import { axiosInstance } from "@/lib/axios";

export async function getCurrentUser() {
  const response = await axiosInstance.get("/user/me");
  return response.data;
}

export async function changePassword(payload: { password: string }) {
  const response = await axiosInstance.post("/auth/change-password", payload);
  return response.data;
}
