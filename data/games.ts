import db from '@/db/drizzle';
import { game, game_teams, teams, players } from '@/db/schema';
import { getUser } from '@/lib/auth';
import { desc, eq, or } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

async function getUserGames(userId: string) {
  const userGames = (
    await db
      .selectDistinct({ gameId: game.id })
      .from(game)
      .innerJoin(game_teams, eq(game.id, game_teams.gameId))
      .innerJoin(teams, eq(game_teams.teamId, teams.id))
      .innerJoin(players, eq(teams.id, players.teamId))
      .where(or(eq(players.userId, userId), eq(game.creator, userId)))
  ).map((row) => row.gameId);

  return await db.query.game.findMany({
    where: (game, { inArray }) => inArray(game.id, userGames),
    orderBy: [desc(game.createdAt)],
    with: {
      winner: {
        columns: {
          id: true,
          name: true
        }
      },
      gameTeams: {
        columns: {
          gameId: false,
          teamId: false
        },
        with: {
          team: {
            with: {
              players: {
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

type UserPlayedGames = Awaited<ReturnType<typeof getUserGames>>[number];

export type UserPlayedGamesDto = UserPlayedGames & {
  userWon: boolean;
};

function toUserPlayedGameDto(
  game: UserPlayedGames,
  userId: string
): UserPlayedGamesDto {
  const winnerTeamId = game.winner.id;
  const winningTeamPlayers = game.gameTeams.find(
    (gT) => gT.team.id === winnerTeamId
  )?.team.players;

  const userWon = !!winningTeamPlayers?.some(
    (player) => player.userId === userId
  );

  return { ...game, userWon };
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
