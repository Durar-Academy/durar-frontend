import { axiosInstance } from "@/lib/axios";

export const tutorApi = {
  getTutorMetrics: async (options?: { signal?: AbortSignal }) => {
    const response = await axiosInstance.get("/metrics/tutordashboard", {
      signal: options?.signal,
    });
    return response.data.data as DashboardTutorsMetrics;
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
    limit = 1000,
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

  getTutorActivity: async ({
    limit = 5,
    page = 1,
    signal,
  }: {
    limit?: number;
    page?: number;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get("/activity/tutor", {
      params: { limit, page },
      signal,
    });
    return response.data.data as TutorActivityResponse;
  },

  getStudentActivity: async ({
    userId,
    limit = 10,
    page = 1,
    signal,
  }: {
    userId: string;
    limit?: number;
    page?: number;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get(`/activity/student/${userId}`, {
      params: { limit, page },
      signal,
    });
    return response.data.data as StudentActivityResponse;
  },

  getTutorPayments: async ({
    limit = 10,
    page = 1,
    signal,
  }: {
    limit?: number;
    page?: number;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get("/payment", {
      params: { limit, page },
      signal,
    });
    return response.data.data as TutorPaymentsResponse;
  },

  getStudentNotes: async ({ studentId, page = 1, limit = 10, signal }: { studentId: string; page?: number; limit?: number; signal?: AbortSignal }) => {
    const response = await axiosInstance.get(`/note/student/${studentId}`, {
      params: { page, limit },
      signal,
    });
    return response.data.data as StudentNotesResponse;
  },

  addStudentNote: async (payload: { title: string; content: string; studentId: string }) => {
    const response = await axiosInstance.post("/note", payload);
    return response.data;
  },

  getTutorNotifications: async ({
    limit = 10,
    page = 1,
    signal,
  }: {
    limit?: number;
    page?: number;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get("/notification/my", {
      params: { limit, page },
      signal,
    });
    return response.data.data as TutorNotificationsResponse;
  },

  getTutorTimetable: async ({
    limit = 1000,
    page = 1,
    signal,
  }: {
    limit?: number;
    page?: number;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get("/class", {
      params: { limit, page },
      signal,
    });
    return response.data.data as TutorTimetableResponse;
  },
};