'use client';
import React from 'react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { signout } from '@/actions/signout';
import { LogOutIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const SignOutMenuItem = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  async function handleSignOut(e: Event) {
    e.preventDefault();
    await signout();
    await queryClient.invalidateQueries({ queryKey: ['user'] });
    router.push('/login');
  }

  return (
    <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
      <LogOutIcon name="LogOut" className="w-4 h-4 mr-2" />
      <span>Sign Out</span>
    </DropdownMenuItem>
  );
};
