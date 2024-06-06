import { CricketGameType } from '.';
import { ThrownDart, ThrownNumber } from './types';

export type TeamsStats = {
  id: string;
  name: string;
  score: number;
  pointsPerRound: number;
  players: PlayerDartsStats | null;
};

export type PlayerDartsStats = {
  [playerName: string]: {
    teamName: string;
    darts: ThrownNumber[];
    doubles: number;
    triples: number;
    singles: number;
    misses: number;
    totalPoints: number;
    pointsPerTurn: number;
    pointsPerDart: number;
  };
};

export class CricketStatisticGenerator {
  private MAX_THROWS = 3;

  public getTeamsStatistic(
    playedTurns: Array<CricketGameType>
  ): TeamsStats[] | null {
    if (!playedTurns.length) {
      return null;
    }

    const teamPointsHistory = this.getTeamsPointsHistory(playedTurns);
    const teams = playedTurns[0].teams.map(({ id, name }) => ({ id, name }));

    return teams.map(({ id, name }) => {
      const currTeam = teamPointsHistory[name];

      if (!currTeam) {
        return {
          id,
          name,
          score: 0,
          pointsPerRound: 0,
          players: null
        };
      }

      const teamPlayedTurns = playedTurns.filter(
        (turn) => turn.currentTeam.name === name
      );

      const totalScore = currTeam.at(-1) || 0;
      const playerStats = this.getPlayersStatistic(teamPlayedTurns) || {};

      return {
        id,
        name,
        score: totalScore,
        pointsPerRound: totalScore / teamPointsHistory[name].length,
        players: playerStats
      };
    });
  }

  private getTeamsPointsHistory(playedRounds: Array<CricketGameType>) {
    if (!playedRounds.length) {
      return {};
    }

    const pointsEachRound = playedRounds.reduce((acc, round) => {
      round.teams.forEach((team, idx) => {
        if (round.currentTeam.name === team.name) {
          acc[team.name] = acc[team.name] || [];
          acc[team.name].push(team.points);
        }
      });

      return acc;
    }, {} as Record<string, number[]>);

    return pointsEachRound;
  }

  /**
   * Returns players statistic scoped by the team they belong to.
   * For each player stats of darts thrown,
   *  number of doubles, triples, singles, misses, total points and points per turn are calculated.
   * @param playedTurns history of all played turns in the game
   */
  private getPlayersStatistic(
    playedTurns: Array<CricketGameType>
  ): PlayerDartsStats | null {
    if (!playedTurns.length) {
      return null;
    }

    return this.getPlayersDartsStats(playedTurns);
  }

  private getPlayersDartsStats(playedTurns: Array<CricketGameType>) {
    if (!playedTurns.length) {
      return {};
    }

    return playedTurns.reduce((acc, round) => {
      if (!round.currentPlayer) {
        return acc;
      }

      // will always have a team name, so we can safely cast it to string
      const teamName = round.teams.find(
        (t) => t.name === round.currentTeam.name
      )?.name as string;

      acc[round.currentPlayer.name] = acc[round.currentPlayer.name] || {
        teamName,
        darts: [],
        doubles: 0,
        triples: 0,
        singles: 0,
        misses: 0,
        totalPoints: 0,
        pointsPerTurn: 0,
        pointsPerDart: 0
      };

      const stats = acc[round.currentPlayer.name];

      stats.darts.push(...round.thrownDarts);

      stats.singles += this.getDartsMultiplierCount(round.thrownDarts, 1);
      stats.doubles += this.getDartsMultiplierCount(round.thrownDarts, 2);
      stats.triples += this.getDartsMultiplierCount(round.thrownDarts, 3);
      stats.misses += this.MAX_THROWS - round.thrownDarts.length;

      stats.totalPoints += round.thrownDarts.reduce(
        (acc, dart) => acc + dart.points,
        0
      );
      stats.pointsPerTurn =
        stats.totalPoints /
        // we can get played rounds by summing up all darts thrown + misses and divided by max throws per players round
        ((stats.singles + stats.doubles + stats.triples + stats.misses) /
          this.MAX_THROWS);
      stats.pointsPerDart = stats.totalPoints / stats.darts.length;

      return acc;
    }, {} as PlayerDartsStats);
  }

  private getDartsMultiplierCount(darts: ThrownDart[], multiplier: 1 | 2 | 3) {
    return darts.filter((dart) => dart.multiplier === multiplier).length;
  }
}
