import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdminProfile, AdminProfileUpdate } from '@/lib/admin-settings';

export function useUpdateAdminProfile(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminProfileUpdate) => {
      if (!userId) {
        return Promise.reject(new Error('Unable to update the profile before the current user is loaded.'));
      }
      return updateAdminProfile(userId, payload);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['currentUser'], user);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}
