import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['student-session-wallet'] });
      queryClient.invalidateQueries({ queryKey: ['student-session-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['all-student-payments'] });
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['student-session-wallet'] });
      queryClient.invalidateQueries({ queryKey: ['student-session-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['all-student-payments'] });
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
