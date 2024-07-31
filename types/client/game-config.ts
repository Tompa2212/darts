import { cricketConfigSchema } from '@/schema/games-config.schema';
import { z } from 'zod';

export type ConfigTeam = z.infer<typeof cricketConfigSchema>['teams'][number];

export type ConfigTeamPlayer = ConfigTeam['players'][number];
