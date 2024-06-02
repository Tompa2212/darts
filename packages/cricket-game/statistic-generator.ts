import { CricketGameType } from '.';
import { ThrownNumber } from './types';

type PlayerDartsStats = Record<
  string,
  {
    teamName: string;
    darts: ThrownNumber[];
    doubles: number;
    triples: number;
    singles: number;
    misses: number;
  }
>;

export class CricketStatisticGenerator {
  private MAX_THROWS = 3;

  getPlayersStatistic(playedRounds: Array<CricketGameType>) {
    if (!playedRounds.length) {
      return null;
    }

    const roundsByTeam = playedRounds.reduce((acc, round) => {
      round.teams.forEach((team, idx) => {
        if (round.currentTeam === idx) {
          acc[team.name] = acc[team.name] || [];
          acc[team.name].push(round);
        }
      });

      return acc;
    }, {} as Record<string, CricketGameType[]>);

    const stats = Object.entries(roundsByTeam).reduce(
      (acc, [teamName, rounds]) => {
        acc[teamName] = this.getPlayersDartsStats(rounds);
        return acc;
      },
      {} as Record<string, PlayerDartsStats>
    );

    return stats;
  }

  getTeamsStatistic(playedRounds: Array<CricketGameType>) {
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
      const playerStats = this.getPlayersStatistic(playedRounds) || {};

      return {
        id: id,
        name,
        score: teamPointsHistory[name].at(-1),
        pointsPerRound: totalScore / teamPointsHistory[name].length,
        players: playerStats[name] || null
      };
    });

    return teamsStats;
  }

  private getTeamsPointsHistory(playedRounds: Array<CricketGameType>) {
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

  private getPlayersPointsHistory(playedRounds: Array<CricketGameType>) {
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

  private getPlayersDartsStats(playedRounds: Array<CricketGameType>) {
    if (!playedRounds.length) {
      return {};
    }

    return playedRounds.reduce((acc, round) => {
      if (!round.currentPlayer) {
        return acc;
      }

      acc[round.currentPlayer.name] = acc[round.currentPlayer.name] || {
        teamName: round.teams[round.currentTeam].name,
        darts: [],
        doubles: 0,
        triples: 0,
        singles: 0,
        misses: 0
      };

      const stats = acc[round.currentPlayer.name];

      stats.darts.push(...round.thrownDarts);
      stats.singles += this.getDartsMultiplierCount(round.thrownDarts, 1);
      stats.doubles += this.getDartsMultiplierCount(round.thrownDarts, 2);
      stats.triples += this.getDartsMultiplierCount(round.thrownDarts, 3);
      stats.misses += this.MAX_THROWS - round.thrownDarts.length;

      return acc;
    }, {} as PlayerDartsStats);
  }

  private getDartsMultiplierCount(
    darts: ThrownNumber[],
    multiplier: 1 | 2 | 3
  ) {
    return darts.filter((dart) => dart.multiplier === multiplier).length;
  }
}
