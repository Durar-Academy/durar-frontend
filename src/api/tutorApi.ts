import { axiosInstance } from "@/lib/axios";

export type SubmissionUser = {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

export type StudentSubmissionRow = {
  id: string;
  assignmentId: string;
  userId: string;
  content?: string | null;
  submissionLink?: string | null;
  grade: number | null;
  gradedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: SubmissionUser | null;
  assignment?: {
    id?: string;
    title?: string | null;
    totalScore?: number | null;
  } | null;
  gradedBy?: SubmissionUser | null;
};

export type StudentSubmissionsMetaData = {
  page: number;
  perPage: number;
  pageCount: number;
  totalCount: number;
  hasPreviousPages: boolean;
  hasNextPages: boolean;
  links: Array<{ number: number; url: string }>;
};

export type StudentSubmissionsResponse = {
  records: StudentSubmissionRow[];
  metaData: StudentSubmissionsMetaData;
};

export type SubmissionRecording = {
  id: string;
  position: number;
  duration: number;
  file: Media;
};

export type SubmissionFeedbackEntry = {
  id: string;
  feedback: string;
  createdAt: Date | string;
  user?: SubmissionUser | null;
};

export type SubmissionDetail = StudentSubmissionRow & {
  files?: Media[] | null;
  recordings?: SubmissionRecording[] | null;
  AssignmentFeedback?: SubmissionFeedbackEntry[] | null;
  feedbacks?: SubmissionFeedbackEntry[] | null;
};

export type QuizSubmissionRow = QuizSubmission & {
  user?: SubmissionUser | null;
};

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
    search,
    signal,
  }: {
    limit?: number;
    page?: number;
    search?: string;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get("/user-course/tutor-students", {
      params: { limit, page, ...(search ? { search } : {}) },
      signal,
    });

    const payload = response.data.data as {
      records?: Array<{
        userId: string;
        user?: {
          id?: string;
          firstName?: string | null;
          lastName?: string | null;
          email?: string | null;
          status?: string | null;
        } | null;
        course?: { category?: string | null } | null;
      }>;
      metaData?: TutorStudentsResponse["metaData"];
    };

    return {
      records: (payload.records ?? []).map((record) => ({
        studentId: record.user?.id ?? record.userId,
        studentName: [record.user?.firstName, record.user?.lastName]
          .filter(Boolean)
          .join(" ") || "Unnamed student",
        category: record.course?.category ?? "Uncategorized",
        email: record.user?.email ?? "",
        status: record.user?.status ?? "inactive",
        time: "",
        day: "",
      })),
      metaData: payload.metaData ?? {
        page,
        perPage: limit,
        pageCount: 0,
        totalCount: 0,
        hasPreviousPages: page > 1,
        hasNextPages: false,
        links: [],
      },
    } satisfies TutorStudentsResponse;
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
    console.log(response.data.data, "RESPONSE DATA NEW");
    return response.data.data as TutorClassesResponse;
  },
  getTutorAssignments: async ({
    limit = 100,
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
    limit = 100,
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

  getStudentAssignments: async ({
    userId,
    limit = 100,
    page = 1,
    signal,
  }: {
    userId: string;
    limit?: number;
    page?: number;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get("/assignment", {
      params: { userId, limit, page },
      signal,
    });
    return response.data.data as { 
      records: Assignment[]; 
      metaData: {
        page: number;
        perPage: number;
        pageCount: number;
        totalCount: number;
        hasPreviousPages: boolean;
        hasNextPages: boolean;
        links: Array<{ number: number; url: string }>;
      };
    };
  },

  getStudentSubmissions: async ({
    userId,
    assignmentId,
    limit = 100,
    page = 1,
    signal,
  }: {
    userId?: string;
    assignmentId?: string;
    limit?: number;
    page?: number;
    signal?: AbortSignal;
  }) => {
    const response = await axiosInstance.get("/submission", {
      params: { userId, assignmentId, limit, page },
      signal,
    });

    const payload = response.data.data as {
      records?: StudentSubmissionRow[];
      metaData?: StudentSubmissionsMetaData;
    } | null;

    return {
      records: payload?.records ?? [],
      metaData: payload?.metaData ?? {
        page,
        perPage: limit,
        pageCount: 0,
        totalCount: 0,
        hasPreviousPages: page > 1,
        hasNextPages: false,
        links: [],
      },
    } satisfies StudentSubmissionsResponse;
  },

  getSubmission: async ({ submissionId, signal }: { submissionId: string; signal?: AbortSignal }) => {
    const response = await axiosInstance.get(`/submission/${submissionId}`, { signal });
    return response.data.data as SubmissionDetail;
  },

  gradeSubmission: async ({ submissionId, grade }: { submissionId: string; grade: number }) => {
    const response = await axiosInstance.post(`/submission/${submissionId}/grade`, { grade });
    return response.data;
  },

  createAssignmentFeedback: async ({ feedback, submissionId }: { feedback: string; submissionId: string }) => {
    const response = await axiosInstance.post("/assignment-feedback", { feedback, submissionId });
    return response.data;
  },

  getQuizSubmissions: async ({ assignmentId, signal }: { assignmentId: string; signal?: AbortSignal }) => {
    const response = await axiosInstance.get(`/quiz/all/${assignmentId}`, { signal });
    return (response.data.data ?? []) as QuizSubmissionRow[];
  },
};
