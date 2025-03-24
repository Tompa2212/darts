import { useQuery } from '@tanstack/react-query';

async function fetchUsers(username: string) {
  const res = await fetch(`/api/users?username=${username}`);

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const { data } = await res.json();
  return data;
}

export const useUserSearch = (username: string) => {
  const data = useQuery({
    queryKey: ['users', username],
    enabled: username.length > 2,
    initialData: [],
    staleTime: 0,
    queryFn: async () => fetchUsers(username)
  });

  return data;
};
