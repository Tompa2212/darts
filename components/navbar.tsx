import { Heading } from './ui/heading';

import Link from 'next/link';
import React from 'react';
import { NavbarBreadcrumbs } from './nav-breadcrumbs';
import { getUser } from '@/lib/auth';
import UserAccountNav from './user-account-menu';
import { buttonVariants } from './ui/button';
import { Icon } from './ui/icon';
import logo from '@/public/logo-no-background.svg';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { lumanosimo } from '@/app/fonts';

export async function Navbar() {
  const user = await getUser();

  return (
    <nav className="flex flex-col bg-zinc-50 shadow-md h-[var(--navbar-height)]">
      <div className="flex-1 container flex items-center gap-4 sm:gap-6 py-2">
        <Link href="/" className="flex gap-2 sm:gap-4 items-center">
          <Image
            src={logo}
            alt="Bullseye Buddy logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <Heading
            className={cn(
              'hidden sm:block leading-none italic -ml-1',
              lumanosimo.className
            )}
          >
            Bullseye Buddy
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
