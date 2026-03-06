import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/shared/components/ui/dropdown-menu";
import { Menu, User, LogOut } from "lucide-react";
import React from 'react';
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useRouter } from "next/navigation";

const UserAccountDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none">Navigation</p>
            {user && (
              <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/')}>Home</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/categories')}>Categories</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/stores')}>Stores</DropdownMenuItem>
        <DropdownMenuSeparator />
        {user && (
          <>
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountDropdown;