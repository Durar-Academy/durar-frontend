import { axiosInstance } from './axios';

export type BillingPlan = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval?: string | null;
  sessionsPerWeek: number;
  gracePeriodDays: number;
  maxCarryForwardSessions: number;
  description?: string | null;
  active: boolean;
};

export type Subscription = {
  id: string;
  status: string;
  periodStart?: string | null;
  periodEnd?: string | null;
  chargeAt?: string | null;
  gracePeriodEndsAt?: string | null;
  renewalMode?: 'automatic' | 'manual' | null;
  paymentChannel?: string | null;
  billingPlan: BillingPlan;
};

export async function getBillingPlans(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get('/plan', { signal: options?.signal });
  const data = response.data?.data ?? response.data;
  return (Array.isArray(data) ? data : data?.records ?? []) as BillingPlan[];
}

export async function getSubscriptions(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get('/subscription', { signal: options?.signal });
  const data = response.data?.data ?? response.data;
  return (Array.isArray(data) ? data : data?.records ?? []) as Subscription[];
}

export async function createSubscription(payload: {
  billingPlanId: string;
  paymentMethodId: string;
  currency: string;
  provider: string;
}) {
  const response = await axiosInstance.post('/subscription', payload);
  return response.data?.data ?? response.data;
}

export async function initializeSubscriptionPayment(payload: { billingPlanId: string; idempotencyKey: string }) {
  const response = await axiosInstance.post('/payment/initialize', {
    billingPlanId: payload.billingPlanId,
    provider: 'paystack',
    memo: 'Monthly course access subscription',
  }, {
    headers: { 'Idempotency-Key': payload.idempotencyKey },
  });
  return response.data?.data ?? response.data;
}

export async function cancelSubscription(subscriptionId: string, reason?: string) {
  const response = await axiosInstance.put(`/subscription/${subscriptionId}`, { reason });
  return response.data?.data ?? response.data;
}

export async function retrySubscriptionPayment(subscriptionId: string) {
  const response = await axiosInstance.post(`/subscription/${subscriptionId}/retry`);
  return response.data?.data ?? response.data;
}

export async function getSessionWallet(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get('/session-wallet/current', { signal: options?.signal });
  return response.data?.data ?? response.data;
}

export async function getSessionBookings(options?: { signal?: AbortSignal }) {
  const response = await axiosInstance.get('/session-wallet/bookings', { signal: options?.signal });
  return response.data?.data ?? response.data;
}

export async function cancelSessionBooking(bookingId: string, reason?: string) {
  const response = await axiosInstance.post(`/session-wallet/bookings/${bookingId}/cancel`, { reason });
  return response.data?.data ?? response.data;
}

export async function getClassOccurrences(options?: { signal?: AbortSignal; from?: string; to?: string }) {
  const response = await axiosInstance.get('/class/occurrences', {
    signal: options?.signal,
    params: { from: options?.from, to: options?.to },
  });
  return response.data?.data ?? response.data;
}

export async function bookClassOccurrence(occurrenceId: string) {
  const response = await axiosInstance.post(`/class/${occurrenceId}/occurrences/student-book`);
  return response.data?.data ?? response.data;
}

export async function requestClassAbsence(bookingId: string, reason: string) {
  const response = await axiosInstance.post(`/class/bookings/${bookingId}/absence`, { reason });
  return response.data?.data ?? response.data;
}
