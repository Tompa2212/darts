'use server';

import db from '@/db/drizzle';
import { teams, players as playersTable } from '@/db/schema';
import { addTeamSchema } from '@/schema/team.schema';
import { NewPlayer } from '@/types/player';
import { revalidatePath } from 'next/cache';

export async function addTeam({
  userId,
  ...values
}: {
  userId: string;
  name: string;
  players: NewPlayer[];
}) {
  const validatedFields = addTeamSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields!'
    };
  }

  const { name, players } = validatedFields.data;

  revalidatePath('/teams');

  const existingTeam = await db.query.teams.findFirst({
    where: (team, { eq, and }) =>
      and(eq(team.userId, userId), eq(team.name, name))
  });

  if (existingTeam) {
    return {
      error: 'Team already exists!'
    };
  }

  const created = await db.transaction(async (tx) => {
    const team = await tx.insert(teams).values({ name, userId }).returning();
    const added = team[0];
    if (added === undefined) {
      await tx.rollback();
      return null;
    }

    await tx.insert(playersTable).values(
      players.map((player) => {
        if ('id' in player) {
          return {
            ...player,
            userId: player.id,
            teamId: added.id
          };
        }

        return {
          ...player,
          teamId: added.id
        };
      })
    );

    return added;
  });

  return created || { error: 'Failed to create team!' };
}
