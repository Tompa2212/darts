import * as z from 'zod';

export const saveCricketGameSchema = z.object({
  winner: z.object({ id: z.string(), name: z.string() }),
  maxRounds: z.number(),
  currentRound: z.number(),
  numbers: z.array(z.number()),
  teams: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      players: z.array(
        z.object({
          id: z.string().or(z.null()).optional(),
          name: z.string()
        })
      )
    })
  )
});
