'use client';

import { fetchCurrentUser } from '@/api/user.api';
import type { SessionUser } from '@/auth';
import { useQuery } from '@tanstack/react-query';

async function queryFn() {
  try {
    const data = await fetchCurrentUser();
    return data.data;
  } catch {
    return null;
  }
}

export const useUser = () => {
  const { data } = useQuery<SessionUser>({
    queryKey: ['user'],
    queryFn
  });

  return data;
};
