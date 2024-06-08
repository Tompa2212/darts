import { getUserTeams } from '@/data/teams';
import { getUser } from '@/lib/auth';
import { StatusCodes } from 'http-status-codes';

export const GET = async () => {
  const user = await getUser();

  if (!user) {
    return Response.json(
      {
        message: 'Unauthorized',
        status: StatusCodes.UNAUTHORIZED
      },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const userTeams = await getUserTeams(user.id);

  return Response.json({ data: userTeams });
};
