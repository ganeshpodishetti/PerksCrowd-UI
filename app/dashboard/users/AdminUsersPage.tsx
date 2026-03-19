'use client'

import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminUsersTable from '@/features/admin/components/tables/AdminUsersTable/AdminUsersTable';
import { useAdminUsers } from '@/features/admin/hooks/useAdminUsers';

export default function AdminUsersPage() {
  const { users, isLoading, refetch, deleteUser } = useAdminUsers();

  const handleRefresh = () => {
    refetch();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser(userId);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="User Management"
        description="Manage platform users"
        onCreateAction={handleRefresh}
        createButtonText="Refresh"
      />

      <AdminUsersTable 
        users={users} 
        onDeleteUser={handleDeleteUser}
      />
    </AdminLayout>
  );
}
