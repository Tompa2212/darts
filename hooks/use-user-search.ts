import { searchUsersByUsername } from '@/data/user';
import { useQuery } from '@tanstack/react-query';

export const useUserSearch = (username: string) => {
  const data = useQuery({
    queryKey: ['users', username],
    enabled: username.length > 2,
    initialData: [],
    queryFn: async () => {
      return await searchUsersByUsername(username);
    }
  });

  return data;
};
