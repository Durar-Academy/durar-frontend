import { useQuery } from "@tanstack/react-query";

import {
  getAssignments,
  getNotification,
  getNotifications,
  getPaymentMethods,
  getPayments,
} from "@/lib/student";

export function useAssignments() {
  const query = useQuery({ queryKey: ["all-student-assignments"], queryFn: getAssignments });
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
