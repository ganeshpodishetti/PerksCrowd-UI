'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import StoreForm from '@/features/stores/components/forms/StoreForm';
import { useStoreQuery, useUpdateStoreMutation } from '@/features/stores/hooks/useStoresQuery';
import { CreateStoreRequest } from '@/features/stores/services/storeService';
import { use } from 'react';

interface EditStorePageProps {
  params: Promise<{ id: string }>;
}

export default function EditStorePage({ params }: EditStorePageProps) {
  const { id } = use(params);
  const { data: store, isLoading, error } = useStoreQuery(id);
  const updateStoreMutation = useUpdateStoreMutation();

  const handleSave = async (storeData: CreateStoreRequest) => {
    await updateStoreMutation.mutateAsync({ id, data: storeData });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <AdminLoadingSpinner />
      </AdminLayout>
    );
  }

  if (error || !store) {
    return (
      <AdminLayout>
        <AdminHeader 
          title="Brand Not Found"
          description="The brand you're looking for doesn't exist."
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader 
        title="Edit Brand"
        description={`Editing: ${store.title}`}
      />

      <StoreForm
        store={store}
        onSave={handleSave}
        title="Brand Information"
        description="Update the brand details."
      />
    </AdminLayout>
  );
}
