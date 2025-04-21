import { searchUsersByUsername } from '@/data/user';
import { getUser } from '@/lib/auth';
import { StatusCodes } from 'http-status-codes';
import type { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
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

  const queryParams = req.nextUrl.searchParams;
  const username = queryParams.get('username');

  if (!username) {
    return Response.json({ data: [] });
  }

  const users = await searchUsersByUsername(username);

  return Response.json({ data: users });
};
