'use client';

import { SessionUser } from '@/auth';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  const { data, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/session');
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message);
      }

      return json.data.user as SessionUser;
    }
  });

  if (error) {
    return null;
  }

  return data;
};
