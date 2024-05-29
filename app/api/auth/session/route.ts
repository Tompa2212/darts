import { validateRequest } from '@/lib/validate-request';

export const GET = async () => {
  const { user, session } = await validateRequest();

  if (!session) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return Response.json({ data: { user } });
};
