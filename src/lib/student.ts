import { axiosInstance } from "./axios";

export async function initializeLesson(lessonId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.post(`/lesson/${lessonId}/progress`, {
    signal: options?.signal,
  });
  return response.data;
}

export async function updateLessonProgress(
  lessonId: string,
  { progress }: { progress: number },
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.put(
    `/lesson/${lessonId}/progress`,
    { progress },
    { signal: options?.signal },
  );
  return response.data;
}

export async function getAssignments(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/assignment/student", {
    signal: options?.signal,
  });
  return response.data.data.records;
}
