import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, UserItem } from '@/features/auth/services/authService';

export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error, refetch } = useQuery<UserItem[]>({
    queryKey: ['admin-users'],
    queryFn: () => authService.getAllUsers(),
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
