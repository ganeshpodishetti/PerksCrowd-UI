import { UserItem } from '@/features/auth/services/authService';
import { cellRenderers, ColumnDef, DataTable } from '@/shared/components/data-display/DataTable';
import { Badge } from '@/shared/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface AdminUsersTableProps {
  users: UserItem[];
  onDeleteUser?: (userId: string) => void;
}

export default function AdminUsersTable({ users, onDeleteUser }: AdminUsersTableProps) {
  const columns: ColumnDef<UserItem>[] = [
    {
      key: 'username',
      header: 'Username',
      render: (_, user) => cellRenderers.text(user.username)
    },
    {
      key: 'email',
      header: 'Email',
      render: (_, user) => cellRenderers.text(user.email)
    },
    {
      key: 'emailConfirmed',
      header: 'Verified',
      render: (_, user) => (
        user.emailConfirmed ? (
          <Badge variant="default" className="flex items-center gap-1 w-fit">
            <CheckCircle className="h-3 w-3" />
            Yes
          </Badge>
        ) : (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <XCircle className="h-3 w-3" />
            No
          </Badge>
        )
      )
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (_, user) => (
        <div className="flex items-center gap-1 flex-wrap">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role, index) => (
              <Badge key={index} variant="outline" className="capitalize">
                {role}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">No roles</span>
          )}
        </div>
      )
    }
  ];

  const actions = onDeleteUser ? {
    onDelete: onDeleteUser,
  } : undefined;

  return (
    <DataTable
      data={users}
      columns={columns}
      actions={actions}
      emptyMessage="No users found"
    />
  );
}
