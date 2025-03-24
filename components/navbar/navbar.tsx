import Link from 'next/link';
import React from 'react';
import { getUser } from '@/lib/auth';
import UserAccountNav from './user-account-menu';
import { buttonVariants } from '../ui/button';
import logo from '@/public/logo-no-background.svg';
import Image from 'next/image';
import { LogInIcon } from 'lucide-react';

export async function Navbar() {
  const user = await getUser();

  return (
    <nav className="shrink-0 flex flex-col bg-zinc-50 shadow-md h-[var(--navbar-height)]">
      <div className="flex-1 container flex items-center gap-4 sm:gap-6 py-2">
        <Link href="/" className="flex gap-2 sm:gap-4 items-center">
          <Image src={logo} alt="Bullseye Buddy logo" className="w-40" />
        </Link>
        <div className="flex flex-1 justify-end">
          {user ? (
            <>
              <UserAccountNav user={user} />
            </>
          ) : (
            <div className="ml-auto">
              <Link href="/login" className={buttonVariants({ size: 'sm' })}>
                <LogInIcon className="h-4 w-4 mr-2" />
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
