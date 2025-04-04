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
      ),
      stats: z.object({
        playedTurns: z.number(),
        pointsPerRound: z.number(),
        totalPoints: z.number(),
        marksPerRound: z.number(),
        totalMarks: z.number(),
        players: z.record(
          z.string(),
          z.object({
            thrownDarts: z.array(
              z.object({
                number: z.number(),
                multiplier: z.number()
              })
            ),
            singles: z.number(),
            doubles: z.number(),
            triples: z.number(),
            misses: z.number(),
            playedTurns: z.number(),
            totalMarks: z.number(),
            marksPerRound: z.number(),
            marksPerDart: z.number()
          })
        )
      })
    })
  )
});
