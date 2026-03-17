'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import CategoryForm from '@/features/categories/components/forms/CategoryForm';
import { useCreateCategoryMutation } from '@/features/categories/hooks/useCategoriesQuery';
import { CreateCategoryRequest } from '@/features/categories/services/categoryService';

export default function NewCategoryPage() {
  const { isLoading: authLoading } = useAuth();
  const createCategoryMutation = useCreateCategoryMutation();

  const handleSave = async (categoryData: CreateCategoryRequest) => {
    await createCategoryMutation.mutateAsync(categoryData);
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
        title="Create New Category"
        description="Fill in the details to create a new category"
      />

      <CategoryForm
        onSave={handleSave}
        title="Category Information"
        description="Enter the details for your new category."
      />
    </AdminLayout>
  );
}
