import { CricketGameType } from '.';

export class CricketStatisticGenerator {
  static getPlayersStatistic(game: Array<CricketGameType>) {}

  static getTeamsStatistic(playedRounds: Array<CricketGameType>) {
    if (!playedRounds.length) {
      return null;
    }

    const teamPointsHistory = this.getTeamsPointsHistory(playedRounds);
    const teams = playedRounds[0].teams.map(({ id, name }) => ({ id, name }));

    const teamsStats = teams.map(({ id, name }) => {
      const currTeam = teamPointsHistory[name];

      if (!currTeam) {
        return {
          id,
          name,
          score: 0,
          pointsPerRound: 0
        };
      }

      const totalScore = currTeam.at(-1) || 0;

      return {
        id: id,
        name,
        score: teamPointsHistory[name].at(-1),
        pointsPerRound: totalScore / teamPointsHistory[name].length
      };
    });

    return teamsStats;
  }

  private static getTeamsPointsHistory(playedRounds: Array<CricketGameType>) {
    if (!playedRounds.length) {
      return {};
    }

    const pointsEachRound = playedRounds.reduce((acc, round) => {
      round.teams.forEach((team, idx) => {
        if (round.currentTeam === idx) {
          acc[team.name] = acc[team.name] || [];
          acc[team.name].push(team.points);
        }
      });

      return acc;
    }, {} as Record<string, number[]>);

    return pointsEachRound;
  }
}
