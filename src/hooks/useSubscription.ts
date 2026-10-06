import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';

import {
  cancelSessionBooking,
  cancelSubscription,
  createSubscription,
  initializeSubscriptionPayment,
  getBillingPlans,
  getClassOccurrences,
  getSessionBookings,
  getSessionWallet,
  getSubscriptions,
  bookClassOccurrence,
  requestClassAbsence,
  retrySubscriptionPayment,
} from '@/lib/subscription';

export async function invalidateStudentBillingQueries(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ['student-subscriptions'] }),
    queryClient.invalidateQueries({ queryKey: ['student-session-wallet'] }),
    queryClient.invalidateQueries({ queryKey: ['student-session-bookings'] }),
    queryClient.invalidateQueries({ queryKey: ['class-occurrences'] }),
    queryClient.invalidateQueries({ queryKey: ['all-student-payments'] }),
    queryClient.invalidateQueries({ queryKey: ['all-student-payment-methods'] }),
    queryClient.invalidateQueries({ queryKey: ['student-courses'] }),
    queryClient.invalidateQueries({ queryKey: ['all-courses'] }),
  ]);
}

export function useBillingPlans() {
  return useQuery({ queryKey: ['billing-plans'], queryFn: getBillingPlans });
}

export function useSubscriptions() {
  return useQuery({ queryKey: ['student-subscriptions'], queryFn: getSubscriptions });
}

export function useSessionWallet() {
  return useQuery({ queryKey: ['student-session-wallet'], queryFn: getSessionWallet });
}

export function useSessionBookings() {
  return useQuery({ queryKey: ['student-session-bookings'], queryFn: getSessionBookings });
}

export function useClassOccurrences(options?: { from?: string; to?: string }) {
  return useQuery({ queryKey: ['class-occurrences', options], queryFn: () => getClassOccurrences(options) });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubscription,
    onSuccess: async () => {
      await invalidateStudentBillingQueries(queryClient);
    },
  });
}

export function useInitializeSubscriptionPayment() {
  return useMutation({ mutationFn: initializeSubscriptionPayment });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subscriptionId, reason }: { subscriptionId: string; reason?: string }) => cancelSubscription(subscriptionId, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['student-subscriptions'] }),
  });
}

export function useRetrySubscriptionPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: retrySubscriptionPayment,
    onSuccess: async () => {
      await invalidateStudentBillingQueries(queryClient);
    },
  });
}

export function useCancelSessionBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) => cancelSessionBooking(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-session-wallet'] });
      queryClient.invalidateQueries({ queryKey: ['student-session-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['class-occurrences'] });
    },
  });
}

export function useBookClassOccurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookClassOccurrence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-session-wallet'] });
      queryClient.invalidateQueries({ queryKey: ['student-session-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['class-occurrences'] });
    },
  });
}

export function useRequestClassAbsence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason: string }) => requestClassAbsence(bookingId, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['student-session-bookings'] }),
  });
}
