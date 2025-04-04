export function getTeamRegisteredPlayers<
  T extends { players: Array<{ id?: string | null; name: string }> }
>(teams: T[]) {
  return teams
    .map((team) =>
      team.players.map((player) => ({
        ...player
      }))
    )
    .flat()
    .filter((player) => player.id) as {
    id: string;
    name: string;
  }[];
}
