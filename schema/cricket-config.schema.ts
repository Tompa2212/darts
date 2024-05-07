import * as z from 'zod';

export const cricketConfigSchema = z
  .object({
    cricketNumbersOption: z
      .enum(['standard', 'randomNums', 'customNums'])
      .default('standard'),
    numbers: z.number().array().length(7, '7 numbers required').optional(),
    teams: z
      .array(
        z.object({
          name: z.string({ required_error: 'Please enter a team name' }),
          players: z.array(
            z.object({
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
        message:
          'Custom numbers required when selecting "Custom Numbers" option',
        path: ['numbers']
      });
    }
  });
