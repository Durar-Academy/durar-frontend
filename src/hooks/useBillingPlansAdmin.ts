import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBillingPlan, getAllBillingPlans, updateBillingPlan, BillingPlanInput } from '@/lib/billing-admin';

export function useAdminBillingPlans() {
  return useQuery({ queryKey: ['admin-billing-plans'], queryFn: getAllBillingPlans });
}

export function useCreateBillingPlan() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (payload: BillingPlanInput) => createBillingPlan(payload), onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-billing-plans'] });
    queryClient.invalidateQueries({ queryKey: ['billing-plans'] });
  } });
}

export function useUpdateBillingPlan() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<BillingPlanInput> & { active?: boolean } }) => updateBillingPlan(id, payload), onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-billing-plans'] });
    queryClient.invalidateQueries({ queryKey: ['billing-plans'] });
  } });
}
