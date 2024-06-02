'use server';

import db from '@/db/drizzle';
import { teams, players as playersTable } from '@/db/schema';
import { addTeamSchema } from '@/schema/team.schema';
import { NewPlayer } from '@/types/player';
import { revalidatePath } from 'next/cache';

function mapToDbPlayer(
  players: Array<
    | {
        id: string;
        username: string;
      }
    | {
        name: string;
      }
  >,
  teamId: string
) {
  return players.map((player) => {
    if ('id' in player) {
      return {
        ...player,
        userId: player.id,
        teamId,
        name: player.username
      };
    }

    return {
      ...player,
      teamId
    };
  });
}

export async function addTeam({
  userId,
  ...values
}: {
  userId: string;
  name: string;
  players: (
    | {
        id: string;
        username: string;
      }
    | {
        name: string;
      }
  )[];
}) {
  const validatedFields = addTeamSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields!'
    };
  }

  const { name, players } = validatedFields.data;

  const uniquePlayers = new Set(
    players.map((player) => {
      if ('id' in player) {
        return player.username;
      }

      return player.name;
    })
  );

  if (uniquePlayers.size !== players.length) {
    return {
      error: 'Players names must be unique!'
    };
  }

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
    const added = (
      await tx.insert(teams).values({ name, userId }).returning()
    ).at(0);

    if (added === undefined) {
      tx.rollback();
      return null;
    }

    await tx.insert(playersTable).values(mapToDbPlayer(players, added.id));

    return added;
  });

  revalidatePath('/teams');
  revalidatePath('/play');

  return created || { error: 'Failed to create team!' };
}
