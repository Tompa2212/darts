import { getUserTeams } from '@/data/teams';
import { useUser } from '@/hooks/use-user';
import { useQuery } from '@tanstack/react-query';

const fetchFn = async (userId?: string | null) => {
  if (userId) {
    return await getUserTeams(userId);
  }

  return [];
};

export const useUserTeams = () => {
  const user = useUser();

  const { data, error } = useQuery({
    queryKey: ['teams', user?.id],
    initialData: [],
    queryFn: () => fetchFn(user?.id)
  });

  return data;
};
