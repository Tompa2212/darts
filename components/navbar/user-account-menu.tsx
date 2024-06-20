'use client';
import React from 'react';

import NavDesktop from './nav-desktop';
import { SessionUser } from '@/auth';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import NavMobile from './nav-mobile';

const UserAccountNav = ({ user }: { user: SessionUser }) => {
  const isDesktop = useIsDesktop();

  return isDesktop ? <NavDesktop user={user} /> : <NavMobile />;
};

export default UserAccountNav;
