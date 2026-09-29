import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getFileByStorageId } from "@/lib/storage";

import {
  getAssignments,
  getQuizQuestions,
  getStudentAssignment,
  getNotification,
  getNotifications,
  getPaymentMethods,
  getPayments,
  startQuizAttempt,
  PaymentHistoryFilters,
  downloadStudentTransactions,
  getStudentTimetable,
  setPreferredPaymentMethod,
  type StudentQuizQuestion,
  type StudentQuizSubmission,
} from "@/lib/student";

type StudentAssignmentFilters = {
  search?: string;
  courseId?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
};

export function useAssignments(filters?: StudentAssignmentFilters) {
  const query = useQuery<StudentAssignment[]>({
    queryKey: ["all-student-assignments", filters],
    queryFn: () => getAssignments({ filters }),
  });
  return query;
}

export function useStudentAssignment(assignmentId: string) {
  return useQuery<StudentAssignment>({
    queryKey: ["student-assignment", assignmentId],
    queryFn: ({ signal }) => getStudentAssignment(assignmentId, { signal }),
    enabled: !!assignmentId,
  });
}

export function usePayments(filters?: PaymentHistoryFilters) {
  const query = useQuery({
    queryKey: ["all-student-payments", filters],
    queryFn: () => getPayments({ filters }),
    placeholderData: (previous) => previous,
  });
  return query;
}

export function usePaymentMethods() {
  const query = useQuery<PaymentMethod[]>({
    queryKey: ["all-student-payment-methods"],
    queryFn: getPaymentMethods,
    select: (methods) => (Array.isArray(methods) ? methods : []),
  });
  return query;
}

export function useDownloadStudentTransactions() {
  return useMutation({ mutationFn: downloadStudentTransactions });
}

export function useSetPreferredPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setPreferredPaymentMethod,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-student-payment-methods"] }),
  });
}

export function useNotifications() {
  const query = useQuery({ queryKey: ["all-student-notifications"], queryFn: getNotifications });
  return query;
}

export function useNotification(notificationId: string) {
  const query = useQuery({
    queryKey: ["student-notification", notificationId],
    queryFn: () => getNotification(notificationId),
    enabled: !!notificationId,
  });

  return query;
}

export function useFile(fileId?: string | null) {
  const query = useQuery<Media>({
    queryKey: ["file", fileId],
    queryFn: () => getFileByStorageId(fileId as string),
    enabled: !!fileId,
  });

  return query;
}

export function useQuizQuestions(assignmentId: string, options?: { enabled?: boolean }) {
  return useQuery<StudentQuizQuestion[]>({
    queryKey: ["quiz-questions", assignmentId],
    queryFn: ({ signal }) => getQuizQuestions(assignmentId, { signal }),
    enabled: !!assignmentId && (options?.enabled ?? true),
    // Question rows are static while an attempt is open; a background refetch
    // would rebuild (and re-shuffle) the paper under the student.
    staleTime: Infinity,
  });
}

export function useStartQuizAttempt() {
  return useMutation<StudentQuizSubmission, Error, string>({
    mutationFn: (assignmentId) => startQuizAttempt(assignmentId),
  });
}

export function useStudentTimetable() {
  const query = useQuery<any, Error, Schedule[]>({
    queryKey: ["student-timetable"],
    queryFn: getStudentTimetable,
    select: (data) => {
      if (Array.isArray(data)) return data;
      if (data?.records && Array.isArray(data.records)) return data.records;
      if (typeof data === "object") {
        return Object.values(data).flatMap((dayArray: unknown) =>
          Array.isArray(dayArray) ? dayArray : [],
        );
      }
      return [];
    },
  });

  return query;
}
