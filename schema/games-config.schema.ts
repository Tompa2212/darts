import { gameModes } from '@/packages/zero-one';
import { z } from 'zod';

export const cricketConfigSchema = z
  .object({
    cricketNumbersOption: z.enum(['standard', 'randomNums', 'customNums']).default('standard'),
    numbers: z.number().array().length(7, '7 numbers required').optional(),
    teams: z
      .array(
        z.object({
          id: z.string(),
          name: z.string({ required_error: 'Please enter a team name' }),
          players: z.array(
            z.object({
              id: z.string().or(z.null()).optional(),
              name: z.string({ required_error: 'Please enter a player name' })
            })
          )
        })
      )
      .min(1, 'Minimum 2 teams required')
  })
  .superRefine((data, context) => {
    if (data.cricketNumbersOption === 'customNums' && !data.numbers) {
      return context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom numbers required when selecting "Custom Numbers" option',
        path: ['numbers']
      });
    }
  });

export const zeroOneConfigSchema = z.object({
  type: z.enum(gameModes),
  sets: z.preprocess(
    Number,
    z
      .number()
      .min(1, { message: 'Atleast one set needs to be played' })
      .max(20, { message: 'Maximum 20 sets allowed' })
  ),
  legs: z.preprocess(
    Number,
    z
      .number()
      .min(1, { message: 'Atleast one leg needs to be played' })
      .max(20, { message: 'Maximum 20 legs allowed' })
  ),
  doubleOut: z.boolean(),
  teams: z
    .array(
      z.object({
        id: z.string(),
        name: z.string({ required_error: 'Please enter a team name' }),
        players: z.array(
          z.object({
            id: z.string().or(z.null()).optional(),
            name: z.string({ required_error: 'Please enter a player name' })
          })
        )
      })
    )
    .min(1, 'Minimum 1 team required')
});
