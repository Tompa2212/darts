import { getUserTeams } from '@/data/teams';
import { useQuery } from '@tanstack/react-query';

export const useUserTeams = () => {
  const { data } = useQuery({
    queryKey: ['teams'],
    staleTime: 0,
    queryFn: async () => {
      return (await getUserTeams()).map(({ playedGames, wonGames, members, ...team }) => ({
        ...team,
        players: [...members]
      }));
    }
  });

  return data || [];
};
