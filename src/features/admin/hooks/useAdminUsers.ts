import { authService, UserItem } from '@/features/auth/services/authService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAdminUsers = (enabled = true) => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error, refetch } = useQuery<UserItem[]>({
    queryKey: ['admin-users'],
    queryFn: () => authService.getAllUsers(),
    enabled,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => authService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
  };
};
