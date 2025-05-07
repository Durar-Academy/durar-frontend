import { axiosInstance } from "@/lib/axios";

export const tutorApi = {
  getTutorMetrics: async (options?: { signal?: AbortSignal }) => {
    const response = await axiosInstance.get("/metrics/tutordashboard", {
      signal: options?.signal,
    });
    return response.data.data as TutorsMetrics;
  },
  getTutorDashboard: async (options?: { signal?: AbortSignal }) => {
    const response = await axiosInstance.get("/metrics/tutordashboard", {
      signal: options?.signal,
    });
    return response.data.data as TutorsDashboard;
  },
  getTutorStudents: async ({
    limit = 10,
    page = 1,
    signal,
  }: {
    limit?: number;
    page?: number;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get("/class/tutor-student", {
      params: { limit, page },
      signal,
    });
    return response.data.data as TutorStudentsResponse;
  },
  getTutorClasses: async ({
    limit = 10,
    page = 1,
    signal,
  }: {
    limit?: number;
    page?: number;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get("/class/tutorclass", {
      params: { limit, page },
      signal,
    });
    return response.data.data as TutorClassesResponse;
  },
  getTutorAssignments: async ({
    limit = 10,
    page = 1,
    signal,
  }: {
    limit?: number;
    page?: number;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get("/assignment/tutor", {
      params: { limit, page },
      signal,
    });
    return response.data.data as TutorAssignmentsResponse;
  },
  getUserProfile: async (id: string, options?: { signal?: AbortSignal }) => {
    const response = await axiosInstance.get(`/user/${id}`, {
      signal: options?.signal,
    });
    return response.data.data as UserProfileResponse;
  },
};