import { axiosInstance } from './axios';
import type { BillingPlan } from './subscription';

export type BillingPlanInput = {
  name: string;
  amount: number;
  currency: string;
  interval: string;
  sessionsPerWeek: number;
  gracePeriodDays: number;
  maxCarryForwardSessions: number;
  description?: string;
};

function unwrap(response: { data: any }) {
  return response.data?.data ?? response.data;
}

export async function getAllBillingPlans() {
  const response = await axiosInstance.get('/plan/admin');
  const data = unwrap(response);
  return (Array.isArray(data) ? data : data?.records ?? []) as BillingPlan[];
}

export async function createBillingPlan(payload: BillingPlanInput) {
  return unwrap(await axiosInstance.post('/plan', payload));
}

export async function updateBillingPlan(id: string, payload: Partial<BillingPlanInput> & { active?: boolean }) {
  return unwrap(await axiosInstance.put(`/plan/${id}`, payload));
}
