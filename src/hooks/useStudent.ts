import { useQuery } from "@tanstack/react-query";

import { getFileByStorageId } from "@/lib/storage";

import {
  getAssignments,
  getNotification,
  getNotifications,
  getPaymentMethods,
  getPayments,
  getStudentTimetable,
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

export function usePayments() {
  const query = useQuery({ queryKey: ["all-student-payments"], queryFn: getPayments });
  return query;
}

export function usePaymentMethods() {
  const query = useQuery<PaymentMethod[]>({
    queryKey: ["all-student-payment-methods"],
    queryFn: getPaymentMethods,
  });
  return query;
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
