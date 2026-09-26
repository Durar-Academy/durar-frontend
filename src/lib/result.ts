import { axiosInstance } from "./axios";

export type StudentResult = {
  id: string;
  ca: number;
  exam: number;
  totalScore: number;
  grade: string;
  session: string;
  status: "draft" | "submitted" | "published" | "locked";
  remarks?: string | null;
  course: {
    id: string;
    title: string;
    category?: string;
    difficultyLevel?: string;
    status?: string;
  };
};

export type TutorResultRosterEntry = {
  userId: string;
  user: { id: string; firstName?: string; lastName?: string; email: string };
  course: { id: string; title: string };
};

export async function getMyResults(options?: { signal?: AbortSignal; session?: string }) {
  const response = await axiosInstance.get("/result/me", {
    signal: options?.signal,
    params: options?.session ? { session: options.session } : undefined,
  });

  const payload = response.data?.data ?? response.data;
  return (Array.isArray(payload) ? payload : payload?.records ?? []) as StudentResult[];
}

export async function getTutorResultRoster(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/user-course/tutor-students", {
    signal: options?.signal,
    params: { page: 1, limit: 100 },
  });
  const payload = response.data?.data ?? response.data;
  return (Array.isArray(payload) ? payload : payload?.records ?? []) as TutorResultRosterEntry[];
}

export async function getCourseResults(courseId: string, session: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/result/course/${courseId}`, {
    signal: options?.signal,
    params: { session },
  });
  const payload = response.data?.data ?? response.data;
  return (Array.isArray(payload) ? payload : payload?.records ?? []) as Array<StudentResult & {
    student: { id: string; firstName: string; lastName: string; email: string };
  }>;
}

export async function createResult(payload: { studentId: string; courseId: string; ca: number; exam: number; session: string }) {
  const response = await axiosInstance.post("/result", payload);
  return response.data?.data ?? response.data;
}

export async function updateResult(id: string, payload: { ca?: number; exam?: number }) {
  const response = await axiosInstance.put(`/result/${id}`, payload);
  return response.data?.data ?? response.data;
}

export async function deleteResult(id: string) {
  const response = await axiosInstance.delete(`/result/${id}`);
  return response.data?.data ?? response.data;
}

export async function changeResultStatus(id: string, action: "submit" | "publish" | "unpublish" | "lock") {
  const response = await axiosInstance.post(`/result/${id}/${action}`);
  return response.data?.data ?? response.data;
}
