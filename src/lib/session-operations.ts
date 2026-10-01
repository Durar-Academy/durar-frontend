import { axiosInstance } from "./axios";

export type SessionAttendanceStatus = "present" | "late" | "absent" | "excused";

export interface SessionOccurrence {
  id: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: string;
  meetingLink?: string | null;
  course?: { id: string; title: string };
  classTemplate?: { id: string; title?: string; userId?: string };
  bookings: Array<{
    id: string;
    status: string;
    student?: { id: string; firstName?: string; lastName?: string; email?: string };
    attendance?: { status: SessionAttendanceStatus } | null;
    absence?: { id: string; status: string; reason: string } | null;
  }>;
}

function unwrap<T>(response: { data?: { data?: T } | T }): T {
  const payload = response.data;
  return (payload && typeof payload === "object" && "data" in payload ? payload.data : payload) as T;
}

export async function getSessionOccurrences(options?: { from?: string; to?: string; signal?: AbortSignal }) {
  const response = await axiosInstance.get("/class/occurrences", {
    params: { from: options?.from, to: options?.to },
    signal: options?.signal,
  });
  return unwrap<SessionOccurrence[]>(response);
}

export async function markSessionAttendance(
  bookingId: string,
  status: SessionAttendanceStatus,
  notes?: string,
) {
  const response = await axiosInstance.post(`/class/bookings/${bookingId}/attendance`, { status, notes });
  return unwrap(response);
}

export async function bookSessionForStudent(occurrenceId: string, studentId: string) {
  const response = await axiosInstance.post(`/class/${occurrenceId}/occurrences/book`, { studentId });
  return unwrap(response);
}

export async function cancelSessionOccurrence(occurrenceId: string, reason?: string) {
  const response = await axiosInstance.post(`/class/occurrences/${occurrenceId}/cancel`, { reason });
  return unwrap(response);
}

export async function reviewSessionAbsence(absenceId: string, approved: boolean, reviewNote?: string) {
  const response = await axiosInstance.put(`/class/absences/${absenceId}/review`, { approved, reviewNote });
  return unwrap(response);
}

export async function getAttendanceWindow() {
  const response = await axiosInstance.get('/class/attendance-window');
  return unwrap<{ minutes: number }>(response);
}

export async function updateAttendanceWindow(minutes: number) {
  const response = await axiosInstance.put('/class/attendance-window', { minutes });
  return unwrap<{ minutes: number }>(response);
}

export interface ReminderSettings {
  subscriptionExpiryReminderDays: number;
  classReminderMinutes: number;
}

export async function getReminderSettings() {
  const response = await axiosInstance.get('/class/reminder-settings');
  return unwrap<ReminderSettings>(response);
}

export async function updateReminderSettings(settings: ReminderSettings) {
  const response = await axiosInstance.put('/class/reminder-settings', settings);
  return unwrap<ReminderSettings>(response);
}
