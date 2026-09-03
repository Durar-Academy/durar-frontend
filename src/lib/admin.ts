import axios from "axios";
import { axiosInstance } from "./axios";

// ─── Courses ──────────────────────────────────────────────────────────────────

export async function createCourse(
  payload: CreateCoursePayload,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.post("/course", payload, {
    signal: options?.signal,
  });

  return response.data.data as Course;
}

export async function getCourse(courseId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/course/${courseId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getCourses(options?: { signal?: AbortSignal; filters?: SearchFilters }) {
  const params = new URLSearchParams();
  if (options?.filters?.search) params.append("search", options.filters.search);
  if (options?.filters?.status) params.append("status", options.filters.status);
  if (options?.filters?.page !== undefined) params.append("page", String(options.filters.page));
  if (options?.filters?.limit !== undefined) params.append("limit", String(options.filters.limit));

  const response = await axiosInstance.get(`/course?${params.toString()}`, {
    signal: options?.signal,
  });

  // Course responses are paginated. Keep the unwrapping defensive because
  // deployments have used both `{ data: { records } }` and nested data
  // envelopes. Consumers of this function should always receive Course[].
  const payload = response.data?.data ?? response.data;
  const records = Array.isArray(payload)
    ? payload
    : payload?.records ?? payload?.data?.records ?? payload?.data;

  return Array.isArray(records) ? records : [];
}

export async function updateCourse(
  courseId: string,
  payload: UpdateCoursePayload,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.put(`/course/${courseId}`, payload, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function deleteCourse(courseId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.delete(`/course/${courseId}`, {
    signal: options?.signal,
  });
  return response.data;
}

export async function getCoursesMetrics(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/course", {
    signal: options?.signal,
  });
  return response.data.data;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getMetrics(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/dashboard", {
    signal: options?.signal,
  });
  return response.data.data;
}

// ─── Schedules ────────────────────────────────────────────────────────────────

export async function getSchedules(options?: { signal?: AbortSignal }) {
  try {
    const response = await axiosInstance.get("/class", {
      signal: options?.signal,
    });
    return response.data.data;
  } catch (error) {
    // React Strict Mode double-mounts components in dev, which cancels the
    // first request's AbortSignal. React Query handles this gracefully and
    // retries — no need to surface it.
    if (!axios.isCancel(error)) {
      console.error("Error fetching schedules:", error);
    }
    throw error;
  }
}

export async function getTimetable(options?: { signal?: AbortSignal }) {
  try {
    const response = await axiosInstance.get("/class/timetable", {
      signal: options?.signal,
    });
    return response.data.data;
  } catch (error) {
    // React Strict Mode double-mounts components in dev, which cancels the
    // first request's AbortSignal. React Query handles this gracefully and
    // retries — no need to surface it.
    if (!axios.isCancel(error)) {
      console.error("Error fetching timetable:", error);
    }
    throw error;
  }
}

export async function createSchedules(
  { classes, courseId }: { classes: CreateSchedule | CreateSchedule[]; courseId: string },
  options?: { signal?: AbortSignal },
) {
  const payload = { classes, courseId };
  console.log("📤 [createSchedules] Request body:", JSON.stringify(payload, null, 2));
  console.log(classes)

  const response = await axiosInstance.post("/class", payload, {
    signal: options?.signal,
  });

  console.log("📥 [createSchedules] Response:", response.data);
  return response.data;
}

export async function updateSchedules(
  { classes }: { classes: CreateSchedule | CreateSchedule[] },
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.put(
    "/class",
    { classes },
    {
      signal: options?.signal,
    },
  );
  return response.data;
}

export async function deleteSchedule(scheduleId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.delete(`/class/${scheduleId}`, { signal: options?.signal });
  return response.data;
}

// ─── Activities ───────────────────────────────────────────────────────────────

export async function getActivities(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/activity", {
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

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function getPayments(
  options?: { signal?: AbortSignal; filters?: PaymentFilters },
) {
  const params = new URLSearchParams();
  if (options?.filters?.userId) params.append("userId", options.filters.userId);
  if (options?.filters?.startAt) params.append("startAt", options.filters.startAt);
  if (options?.filters?.endAt) params.append("endAt", options.filters.endAt);
  if (options?.filters?.page) params.append("page", String(options.filters.page));
  if (options?.filters?.limit) params.append("limit", String(options.filters.limit));

  const response = await axiosInstance.get(`/payment?${params.toString()}`, {
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

export async function getPayment(paymentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/payment/${paymentId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getUserPayments(userId: string, options?: { signal?: AbortSignal }) {
  return getPayments({ signal: options?.signal, filters: { userId } });
}

export async function downloadTransactions(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/payment/download-transactions", {
    signal: options?.signal,
    responseType: "blob",
  });
  return response.data.data;
}

// ─── Students ─────────────────────────────────────────────────────────────────

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

  const payload = response.data?.data ?? response.data;
  const records = Array.isArray(payload)
    ? payload
    : payload?.records ?? payload?.data?.records ?? payload?.data;

  return Array.isArray(records) ? records : [];
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

export async function getStudentAssignments(studentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/assignment?userId=${studentId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function enrollStudent(
  courseId: string,
  userId: string,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.post(`/course/${courseId}/enroll`, { userId }, {
    signal: options?.signal,
  });
  return response.data;
}

// ─── Tutors ───────────────────────────────────────────────────────────────────

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

// ─── Assignments ──────────────────────────────────────────────────────────────

export async function getAssignmentsMetrics(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/metrics/assignment", {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getAssignments(options?: {
  signal?: AbortSignal;
  filters?: AssignmentFilters;
}) {
  const params = new URLSearchParams();
  if (options?.filters?.search) params.append("search", options.filters.search);
  if (options?.filters?.courseId) params.append("courseId", options.filters.courseId);
  if (options?.filters?.status) params.append("status", options.filters.status);
  if (options?.filters?.type) params.append("type", options.filters.type);
  if (options?.filters?.page) params.append("page", String(options.filters.page));
  if (options?.filters?.limit) params.append("limit", String(options.filters.limit));

  const response = await axiosInstance.get(`/assignment?${params.toString()}`, {
    signal: options?.signal,
  });
  return response.data.data.records;
}

export async function getAssignment(assignmentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get(`/assignment/${assignmentId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getAssignmentMetrics(
  assignmentId: string,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.get(`/metrics/assignment?id=${assignmentId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getStudentAssignmentFeedbacks(
  assignmentId: string,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.get(`/assignment-feedback?assignmentId=${assignmentId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function createAssignment(
  payload: CreateAssignmentPayload,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.post("/assignment", payload, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function updateAssignment(
  assignmentId: string,
  payload: UpdateAssignmentPayload,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.put(`/assignment/${assignmentId}`, payload, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function deleteAssignment(assignmentId: string, options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.delete(`/assignment/${assignmentId}`, {
    signal: options?.signal,
  });
  return response.data;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get("/notification/my", {
    signal: options?.signal,
  });
  return response.data.data.data;
}

export async function getAllNotifications(options?: {
  signal?: AbortSignal;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (options?.page) params.append("page", String(options.page));
  if (options?.limit) params.append("limit", String(options.limit));

  const response = await axiosInstance.get(`/notification/all?${params.toString()}`, {
    signal: options?.signal,
  });

  const data = response.data?.data ?? response.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.records)) return data.records;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

export async function createNotification(
  payload: CreateNotificationPayload,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.post("/notification", payload, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function updateNotification(
  notificationId: string,
  payload: UpdateNotificationPayload,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.patch(`/notification/${notificationId}`, payload, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function deleteNotification(
  notificationId: string,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.delete(`/notification/${notificationId}`, {
    signal: options?.signal,
  });
  return response.data;
}

export async function getNotification(
  notificationId: string,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.get(`/notification/${notificationId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export async function createNote(
  payload: { title?: string; content: string; studentId: string },
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.post("/note", payload, {
    signal: options?.signal,
  });
  return response.data.data;
}

export async function getStudentNotes(
  studentId: string,
  options?: { signal?: AbortSignal },
) {
  const response = await axiosInstance.get(`/note/student/${studentId}`, {
    signal: options?.signal,
  });
  return response.data.data;
}
