import { ZeroOneGameType } from '@/packages/zero-one';
import { Team, ZeroOneType } from '@/packages/zero-one/types';
import { zeroOneConfigSchema } from '@/schema/games-config.schema';
import * as z from 'zod';

export type ZeroOneGameConfig = z.infer<typeof zeroOneConfigSchema>;

export type ZeroOneGameInit =
  | {
      teams: Team[];
      doubleOut: boolean;
      sets: number;
      legs: number;
      type: ZeroOneType;
    }
  | { game: ZeroOneGameType };
