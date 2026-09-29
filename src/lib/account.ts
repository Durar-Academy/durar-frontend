import { axiosInstance } from "@/lib/axios";

export async function getCurrentUser(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/user/me", {
    signal: options?.signal,
  });
  const user = response.data.data as User;

  // If profilePicture already has url or there's no profilePictureId, return user
  if (user.profilePicture?.url || !user.profilePictureId) {
    return user;
  }

  // If profilePictureId exists but url is missing, fetch the full media object
  try {
    const fileResponse = await axiosInstance.get(`/file/${user.profilePictureId}`, {
      signal: options?.signal,
    });

    return {
      ...user,
      profilePicture: fileResponse.data.data as Media,
    };
  } catch (error) {
    console.error("Failed to hydrate profile picture metadata for current user:", error);
    return user;
  }
}

export async function changePassword(payload: { password: string }) {
  const response = await axiosInstance.post("/auth/change-password", payload);
  return response.data;
}

export async function inviteTutor(payload: { email: string; courseIds?: string[] }) {
  const response = await axiosInstance.post(`/user/invite-tutor`, payload);
  return response.data;
}

export async function updateUserInfo(payload: Partial<UpdateAccountPayload>, userId: string) {
  const response = await axiosInstance.patch(`/user/${userId}`, payload);
  return response.data;
}
