'use client';
import React from 'react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { signout } from '@/actions/signout';
import { LogOutIcon } from 'lucide-react';

export const SignOutMenuItem = () => {
  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        signout();
      }}
      className="cursor-pointer"
    >
      <LogOutIcon name="LogOut" className="w-4 h-4 mr-2" />
      <span>Sign Out</span>
    </DropdownMenuItem>
  );
};
