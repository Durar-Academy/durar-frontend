import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdminProfile, AdminProfileUpdate } from '@/lib/admin-settings';

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminProfileUpdate) => updateAdminProfile(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}
