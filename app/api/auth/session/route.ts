import { validateRequest } from '@/lib/validate-request';
import { StatusCodes } from 'http-status-codes';

export const GET = async () => {
  const { user, session } = await validateRequest();

  if (!session) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  return Response.json({ data: { user } });
};
