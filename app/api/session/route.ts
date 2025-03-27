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

  return Response.json({ data: user });
};
