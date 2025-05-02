import { axiosInstance } from "@/lib/axios";

export const tutorApi = {
  getTutorMetrics: async (options?: { signal?: AbortSignal }) => {
    const response = await axiosInstance.get("/metrics/tutordashboard", {
      signal: options?.signal,
    });
    return response.data.data as TutorsMetrics;
  },
};