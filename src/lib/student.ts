import { axiosInstance } from "./axios";

type StudentAssignmentFilters = {
  search?: string;
  courseId?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
};

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

export async function getAssignments(options?: {
  signal?: AbortSignal;
  filters?: StudentAssignmentFilters;
}) {
  const params = new URLSearchParams();

  if (options?.filters?.search) params.append("search", options.filters.search);
  if (options?.filters?.courseId) params.append("courseId", options.filters.courseId);
  if (options?.filters?.status) params.append("status", options.filters.status);
  if (options?.filters?.type) params.append("type", options.filters.type);
  if (options?.filters?.page !== undefined) params.append("page", String(options.filters.page));
  if (options?.filters?.limit !== undefined) params.append("limit", String(options.filters.limit));

  const response = await axiosInstance.get(`/assignment/student?${params.toString()}`, {
    signal: options?.signal,
  });

  const data = response.data?.data ?? response.data;

  if (Array.isArray(data)) return data;

  return data?.records ?? [];
}

export async function getPayments(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/payment", {
    signal: options?.signal,
  });
  return response.data.data.records;
}

export async function getPaymentMethods(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/payment-method", {
    signal: options?.signal,
  });
  return response.data;
}

export async function addCard(payload: {
  type: string;
  provider: string;
  name: string;
  billingAddress: {
    addressLine1: string;
    adminArea1: string;
    postalCode: string;
    countryCode: string;
    city: string;
  };
  cardNumber: string;
  expiry: string;
}) {
  const response = await axiosInstance.post(`/payment/initialize`, payload);
  return response.data;
}

export async function getNotifications(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/notification/my", {
    signal: options?.signal,
  });
  return response.data.data.data;
}

export async function getNotification(notificationId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/notification/my/${notificationId}`, {
    signal: options?.signal,
  });
  return response.data;
}

export async function markAsRead(notificationId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.patch(`/notification/${notificationId}/read`, {
    signal: options?.signal,
  });
  return response.data;
}

export async function getStudentTimetable(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/class/timetable", {
    signal: options?.signal,
  });
  return response.data.data;
}
