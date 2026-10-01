import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookSessionForStudent,
  getSessionOccurrences,
  markSessionAttendance,
  cancelSessionOccurrence,
  reviewSessionAbsence,
  getAttendanceWindow,
  updateAttendanceWindow,
  getReminderSettings,
  updateReminderSettings,
  ReminderSettings,
  SessionAttendanceStatus,
} from "@/lib/session-operations";

export function useSessionOccurrences() {
  return useQuery({ queryKey: ["session-occurrences"], queryFn: ({ signal }) => getSessionOccurrences({ signal }) });
}

export function useMarkSessionAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, status, notes }: { bookingId: string; status: SessionAttendanceStatus; notes?: string }) =>
      markSessionAttendance(bookingId, status, notes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session-occurrences"] }),
  });
}

export function useBookSessionForStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ occurrenceId, studentId }: { occurrenceId: string; studentId: string }) =>
      bookSessionForStudent(occurrenceId, studentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session-occurrences"] }),
  });
}

export function useCancelSessionOccurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ occurrenceId, reason }: { occurrenceId: string; reason?: string }) => cancelSessionOccurrence(occurrenceId, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['session-occurrences'] }),
  });
}

export function useReviewSessionAbsence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ absenceId, approved, reviewNote }: { absenceId: string; approved: boolean; reviewNote?: string }) => reviewSessionAbsence(absenceId, approved, reviewNote),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['session-occurrences'] }),
  });
}

export function useAttendanceWindow() {
  return useQuery({ queryKey: ['attendance-window'], queryFn: getAttendanceWindow });
}

export function useUpdateAttendanceWindow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAttendanceWindow,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance-window'] }),
  });
}

export function useReminderSettings() {
  return useQuery({ queryKey: ['reminder-settings'], queryFn: getReminderSettings });
}

export function useUpdateReminderSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: ReminderSettings) => updateReminderSettings(settings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminder-settings'] }),
  });
}
