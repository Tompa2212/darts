import { getUserTeams } from '@/data/teams';
import { getSessionUser } from '@/lib/auth';

export const GET = async () => {
  const user = await getSessionUser();

  if (!user || !user.id) {
    return Response.json(
      {
        message: 'Unauthorized',
        status: 401
      },
      { status: 401 }
    );
  }

  const userTeams = await getUserTeams(user.id);

  return Response.json({ data: userTeams || [] });
};
