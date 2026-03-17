// Migrated from src/components/pages/AdminDealsPage.tsx
'use client'
import AdminLoadingSpinner from '@/features/admin/components/dashboard/AdminLoadingSpinner/AdminLoadingSpinner';
import AdminHeader from '@/features/admin/components/layout/AdminHeader/AdminHeader';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import AdminDealsList from '@/features/admin/components/tables/AdminDealsList/AdminDealsList';
import { useDeleteDealMutation, useUserDealsQuery } from '@/features/deals/hooks/useDealsQuery';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function AdminDealsPage() {
  const router = useRouter();
  const { data: deals = [], isLoading } = useUserDealsQuery();
  const deleteDealMutation = useDeleteDealMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const filteredDeals = useMemo(() => {
    if (!searchTerm.trim()) return deals;
    const term = searchTerm.toLowerCase();
    return deals.filter(d =>
      d.title.toLowerCase().includes(term) ||
      d.description.toLowerCase().includes(term) ||
      d.storeName.toLowerCase().includes(term) ||
      d.categoryName.toLowerCase().includes(term) ||
      (d.discount?.toLowerCase().includes(term) ?? false)
    );
  }, [deals, searchTerm]);

  const handleCreateDeal = () => {
    router.push('/dashboard/deals/new');
  };

  const handleEditDeal = (dealId: string) => {
    router.push(`/dashboard/deals/${dealId}/edit`);
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) {
      return;
    }

    deleteDealMutation.mutate(dealId);
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
        title="Deals Management"
        description="Create and manage your deals"
        onCreateAction={handleCreateDeal}
        createButtonText="Create Deal"
        onSearchDeals={setSearchTerm}
      />

      <AdminDealsList 
        deals={filteredDeals}
        onEditDeal={handleEditDeal}
        onDeleteDeal={handleDeleteDeal}
      />
    </AdminLayout>
  );
}
