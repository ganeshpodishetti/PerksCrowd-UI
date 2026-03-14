import { SubmittedDeal } from '@/shared/types/entities/submittedDeal';
import AdminSubmittedDealsCards from '../AdminSubmittedDealsCards/AdminSubmittedDealsCards';
import AdminSubmittedDealsTable from '../AdminSubmittedDealsTable/AdminSubmittedDealsTable';

interface AdminSubmittedDealsListProps {
  deals: SubmittedDeal[];
  onMarkAsRead: (id: string, isRead: boolean) => void;
  onDelete: (id: string) => void;
}

export default function AdminSubmittedDealsList({ deals, onMarkAsRead, onDelete }: AdminSubmittedDealsListProps) {
  return (
    <>
      <div className="md:hidden">
        <AdminSubmittedDealsCards 
          deals={deals}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      </div>
      <div className="hidden md:block">
        <AdminSubmittedDealsTable 
          deals={deals}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      </div>
    </>
  );
}
