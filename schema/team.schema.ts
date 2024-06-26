import * as z from 'zod';

export const addTeamSchema = z.object({
  name: z.string().min(2, {
    message: 'Team name must have at least 2 characters.'
  }),
  players: z
    .array(
      z
        .object({
          id: z.string(),
          username: z.string()
        })
        .or(z.object({ name: z.string() }))
    )
    .min(1, { message: 'At least one player is required.' })
});
