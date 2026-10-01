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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function unwrap(response: { data: unknown }): unknown {
  if (isRecord(response.data) && 'data' in response.data) {
    return response.data.data;
  }
  return response.data;
}

export async function getAllBillingPlans() {
  const response = await axiosInstance.get('/plan/admin');
  const data = unwrap(response);
  return (Array.isArray(data) ? data : isRecord(data) && Array.isArray(data.records) ? data.records : []) as BillingPlan[];
}

export async function createBillingPlan(payload: BillingPlanInput) {
  return unwrap(await axiosInstance.post('/plan', payload));
}

export async function updateBillingPlan(id: string, payload: Partial<BillingPlanInput> & { active?: boolean }) {
  return unwrap(await axiosInstance.put(`/plan/${id}`, payload));
}
