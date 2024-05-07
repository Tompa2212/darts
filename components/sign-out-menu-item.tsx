'use client';
import React from 'react';
import { DropdownMenuItem } from './ui/dropdown-menu';
import { Icon } from './ui/icon';
import { signOut } from 'next-auth/react';

export const SignOutMenuItem = () => {
  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        signOut();
      }}
      className="cursor-pointer"
    >
      <Icon name="LogOut" className="w-4 h-4 mr-2" />
      <span>Sign Out</span>
    </DropdownMenuItem>
  );
};
