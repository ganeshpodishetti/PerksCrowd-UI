'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import StoreForm from '@/features/stores/components/forms/StoreForm';
import { useCreateStoreMutation } from '@/features/stores/hooks/useStoresQuery';
import { CreateStoreRequest } from '@/features/stores/services/storeService';

export default function NewStorePage() {
  const { isLoading: authLoading } = useAuth();
  const createStoreMutation = useCreateStoreMutation();

  const handleSave = async (storeData: CreateStoreRequest) => {
    await createStoreMutation.mutateAsync(storeData);
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="Create New Brand"
        description="Fill in the details to create a new brand"
      />

      <StoreForm
        onSave={handleSave}
        title="Brand Information"
        description="Enter the details for your new brand."
      />
    </AdminLayout>
  );
}
