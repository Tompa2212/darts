import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import UserAvatar from './user-avatar';
import Link from 'next/link';
import { Icon } from './ui/icon';
import { User } from '@/types/user';
import { SignOutMenuItem } from './sign-out-menu-item';

interface UserAccountNavProps {
  user: Pick<User, 'image' | 'email' | 'id' | 'name' | 'username'>;
}

const UserAccountNav = async ({ user }: UserAccountNavProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} className="w-8 h-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.username ? (
              <p className="font-medium">{user.username}</p>
            ) : null}
            {user.email ? (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            ) : null}
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/teams">
            <Icon name="UsersRound" className="w-4 h-4 mr-2" />
            Manage Teams
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Icon name="Settings" className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
