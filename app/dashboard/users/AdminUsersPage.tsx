'use client'

import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminUsersTable from '@/features/admin/components/tables/AdminUsersTable/AdminUsersTable';
import { useAdminUsers } from '@/features/admin/hooks/useAdminUsers';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { isSuperAdmin } from '@/features/auth/utils/roles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const allowed = isSuperAdmin(user);

  const { users, isLoading, refetch, deleteUser } = useAdminUsers(
    !authLoading && allowed,
  );

  useEffect(() => {
    if (!authLoading && !allowed) {
      router.replace('/dashboard');
    }
  }, [authLoading, allowed, router]);

  const handleRefresh = () => {
    refetch();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser(userId);
    }
  };

  if (authLoading || !allowed || isLoading) {
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
