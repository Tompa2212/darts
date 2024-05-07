import { searchUsersByUsername } from '@/data/user';
import { useQuery } from '@tanstack/react-query';
import { useUser } from './use-user';

export const useUserSearch = (username: string) => {
  const user = useUser();

  const data = useQuery({
    queryKey: ['users', username],
    enabled: !!user?.id && username.length > 2,
    initialData: [],
    queryFn: async () => {
      return await searchUsersByUsername(username);
    }
  });

  return data;
};
