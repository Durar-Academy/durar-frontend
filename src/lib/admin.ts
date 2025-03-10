import { axiosInstance } from "./axios";

export async function getMetrics(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/dashboard", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getSchedules(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/class", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getActivities(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/activity", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getPayments(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/payment", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getStudentsMetrics(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/student", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getStudents(options?: { signal?: AbortSignal; filters?: SearchFilters }) {
  const params = new URLSearchParams();
  if (options?.filters?.search) params.append("search", options.filters.search);
  if (options?.filters?.status) params.append("status", options.filters.status);

  const response = await axiosInstance.get(`/user/students?${params.toString()}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getUser(userId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/user/${userId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getStudentMetrics(studentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/metrics/student?id=${studentId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getStudentCourses(studentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/user-course?role=student&userId=${studentId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getUserActivities(userId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/activity?userId=${userId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getUserPayments(userId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/payment?userId=${userId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getStudentAssignments(studentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/assignment?userId=${studentId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getTutorsMetrics(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/tutor", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getTutors(options?: { signal?: AbortSignal; filters?: SearchFilters }) {
  const params = new URLSearchParams();
  if (options?.filters?.search) params.append("search", options.filters.search);
  if (options?.filters?.status) params.append("status", options.filters.status);

  const response = await axiosInstance.get(`/user/tutors?${params.toString()}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getTutorMetrics(tutorId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/metrics/tutor?id=${tutorId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getTutorCourses(tutorId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/user-course?role=tutor&userId=${tutorId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getCoursesMetrics(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/course", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getCourses(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/course", {
    signal: options?.signal,
  });
  return response.data.data.records;
}

export async function getCourse(courseId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/course/${courseId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getPaymentsMetrics(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/payment", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function downloadTransactions(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/payment/download-transactions", {
    signal: options?.signal,
    responseType: "blob",
  });
  return response.data.data;
}

export async function getPayment(paymentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/payment/${paymentId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function createSchedules(
  { classes, courseId }: { classes: CreateSchedule | CreateSchedule[]; courseId: string },
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.post(
    "/class",
    { classes, courseId },
    {
      signal: options?.signal,
    },
  );
  return response.data;
}

export async function updateSchedules(
  { classes }: { classes: CreateSchedule | CreateSchedule[] },
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.put("/class", classes, {
    signal: options?.signal,
  });
  return response.data;
}
