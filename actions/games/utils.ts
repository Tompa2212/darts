export function getTeamRegisteredPlayers<
  T extends { players: Array<{ id?: string | null; name: string }> }
>(teams: T[]) {
  return teams
    .flatMap((team) =>
      team.players.map((player) => ({
        ...player
      }))
    )
    .filter((player) => player.id) as {
    id: string;
    name: string;
  }[];
}
