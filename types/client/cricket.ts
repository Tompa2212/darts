import { CricketGameType } from '@/packages/cricket-game';
import { Team } from '@/packages/cricket-game/types';
import { cricketConfigSchema } from '@/schema/cricket-config.schema';
import * as z from 'zod';

export type CricketGameConfig = z.infer<typeof cricketConfigSchema>;

export type CricketGameInit =
  | {
      teams: Team[];
      useRandomNums: boolean;
      numbers?: number[];
      maxRounds: number;
    }
  | { game: CricketGameType };
