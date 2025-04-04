import db from '@/db/drizzle';
import { games, teams, teamMembers, gameParticipants } from '@/db/test.schema';
import { getUser } from '@/lib/auth';
import { desc, eq, or } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

type UserPlayedGames = Awaited<ReturnType<typeof getUserGames>>[number];

export type UserPlayedGamesDto = UserPlayedGames & {
  userWon: boolean;
};

function toUserPlayedGameDto(game: UserPlayedGames, userId: string): UserPlayedGamesDto {
  const winnerTeamId = game.winningTeamId;
  const winningTeamPlayers = game.participants.find((gT) => gT.team.id === winnerTeamId)?.team
    .members;

  const userWon = !!winningTeamPlayers?.some((player) => player.userId === userId);

  return { ...game, userWon };
}

async function getUserGames(userId: string) {
  const userGames = (
    await db
      .selectDistinct({ gameId: games.id })
      .from(games)
      .innerJoin(gameParticipants, eq(games.id, gameParticipants.gameId))
      .leftJoin(teams, eq(gameParticipants.teamId, teams.id))
      .leftJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .where(or(eq(teamMembers.userId, userId), eq(games.creatorUserId, userId)))
  ).map((row) => row.gameId);

  return await db.query.games.findMany({
    where: (game, { inArray }) => inArray(game.id, userGames),
    orderBy: [desc(games.completedAt)],
    with: {
      winningTeam: {
        columns: {
          id: true,
          name: true
        }
      },
      detailsCricket: true,
      statsCricketTeam: true,
      detailsX01: true,
      participants: {
        with: {
          team: {
            with: {
              members: {
                columns: {
                  teamId: false
                },
                with: {
                  user: {
                    columns: {
                      id: true,
                      username: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
}

export async function getUserPlayedGames(): Promise<UserPlayedGamesDto[]> {
  noStore();

  const sessionUser = await getUser();

  if (!sessionUser) {
    redirect('/login');
  }

  const { id: userId } = sessionUser;

  try {
    const userGames = await getUserGames(userId);

    return userGames.map((game) => toUserPlayedGameDto(game, userId));
  } catch (error) {
    console.log(error);
    return [];
  }
}
