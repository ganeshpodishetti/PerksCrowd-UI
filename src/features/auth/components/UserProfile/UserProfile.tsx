'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/authService';
import { User } from '@/shared/types/entities/user';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { AtSign, CheckCircle, Mail, Shield, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface UserProfileProps {
  user: User | null;
}

export default function UserProfile({ user }: UserProfileProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!user) {
    return (
      <Card className="border-0">
        <CardContent className="p-6">
          <p className="text-muted-foreground">No user data available</p>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await authService.deleteAccount();
      // Close dialog and redirect to login
      setIsDeleteDialogOpen(false);
      // Redirect to login page after successful deletion
      router.push('/login');
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      if (error.response?.status === 403) {
        setDeleteError('You are not authorized to delete your account. Contact an administrator.');
      } else if (error.response?.status === 401) {
        setDeleteError('Your session has expired. Please log in again.');
      } else {
        setDeleteError(error.response?.data?.title || 'Failed to delete account. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if user is SuperAdmin (case-insensitive)
  // Handle cases where roles might be undefined or not an array
  const isSuperAdmin = Array.isArray(user.roles) && 
    user.roles.some(role => 
      typeof role === 'string' && role.toLowerCase() === 'superadmin'
    );

  // Debug: Show roles in console
  console.log('User roles:', user.roles, 'isSuperAdmin:', isSuperAdmin);

  const handleConfirmDelete = () => {
    // If user is a SuperAdmin, show error since they cannot delete their own account
    if (isSuperAdmin) {
      setDeleteError('SuperAdmin accounts cannot be deleted. Contact another administrator.');
      setIsDeleteDialogOpen(true);
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Card className="border-0">
        <CardContent className="p-6 space-y-6">
          {/* Username Section */}
          {user.username && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <div className="flex items-center gap-2">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                <p className="text-base">{user.username}</p>
              </div>
            </div>
          )}

          {/* Email Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-base">{user.email}</p>
              {user.emailConfirmed ? (
                <Badge variant="default" className="ml-2 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="destructive" className="ml-2 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Not Verified
                </Badge>
              )}
            </div>
          </div>

          {/* Roles Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Roles</label>
            <div className="flex items-center gap-2 flex-wrap">
              <Shield className="h-4 w-4 text-muted-foreground" />
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <Badge key={index} variant="secondary" className="capitalize">
                    {role}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No roles assigned</p>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Account Status</span>
              <Badge variant={user.emailConfirmed ? "default" : "secondary"}>
                {user.emailConfirmed ? "Active" : "Pending Verification"}
              </Badge>
            </div>
          </div>

          {/* Danger Zone - Delete Account */}
          <div className="pt-4 border-t border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isSuperAdmin}
                className="whitespace-nowrap"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
              All your data, including submitted deals and preferences, will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          
          {deleteError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteError(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete My Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
