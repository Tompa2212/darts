import { Heading } from './ui/heading';

import Link from 'next/link';
import React from 'react';
import { NavbarBreadcrumbs } from './nav-breadcrumbs';
import { getUser } from '@/lib/auth';
import UserAccountNav from './user-account-menu';
import { buttonVariants } from './ui/button';
import { Icon } from './ui/icon';

export async function Navbar() {
  const user = await getUser();

  return (
    <nav className="bg-zinc-50 shadow-sm">
      <div className="container py-2 shadow-sm sm:py-4 flex items-center gap-4 sm:gap-6">
        <Link href="/" className="flex gap-2 sm:gap-4">
          <span className="text-2xl inline-block leading-none">🎯</span>
          <Heading className="hidden sm:block leading-none italic -ml-1">
            Darts Hub
          </Heading>
        </Link>
        <div className="flex-1 flex justify-between items-center gap-6">
          <NavbarBreadcrumbs />
          {user ? (
            <>
              <UserAccountNav user={user} />
            </>
          ) : (
            <div className="ml-auto">
              <Link href="/login" className={buttonVariants({ size: 'sm' })}>
                <Icon name="LogIn" className="h-4 w-4 mr-2" />
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
