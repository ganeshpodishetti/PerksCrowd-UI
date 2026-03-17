'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import UniversityForm from '@/features/universities/components/forms/UniversityForm';
import { useCreateUniversityMutation } from '@/features/universities/hooks/useUniversitiesQuery';
import { CreateUniversityRequest } from '@/shared/types/entities/university';

export default function NewUniversityPage() {
  const { isLoading: authLoading } = useAuth();
  const createUniversityMutation = useCreateUniversityMutation();

  const handleSave = async (universityData: CreateUniversityRequest) => {
    await createUniversityMutation.mutateAsync(universityData);
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
        title="Create New University"
        description="Fill in the details to create a new university"
      />

      <UniversityForm
        onSave={handleSave}
        title="University Information"
        description="Enter the details for your new university."
      />
    </AdminLayout>
  );
}
