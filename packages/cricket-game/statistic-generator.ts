import { CricketGameType } from '.';
import { PlayerDartsStats, TeamsStats, ThrownDart } from './types';

export class CricketStatisticGenerator {
  private readonly MAX_THROWS = 3;

  private getDartsMultiplierCount(darts: ThrownDart[], multiplier: 1 | 2 | 3) {
    return darts.filter((dart) => dart.multiplier === multiplier).length;
  }

  public calculateTeamStats(game: CricketGameType) {
    const currentTeam = game.currentTeam;
    const currentPlayer = game.currentPlayer;

    let stats = currentTeam.stats ?? this.getInitialTeamStats();

    stats.playedTurns++;
    stats.totalPoints += game.currentTurnPoints;
    stats.pointsPerRound = stats.totalPoints / stats.playedTurns;

    const playerStats =
      stats.players[currentPlayer.name] ?? this.getInitialPlayerStats();

    this.calculatePlayerStats(playerStats, game);

    stats.players[currentPlayer.name] = playerStats;

    currentTeam.stats = stats;
  }

  private calculatePlayerStats(
    playerStats: PlayerDartsStats[string],
    game: CricketGameType
  ) {
    playerStats.thrownDarts.push(...game.thrownDarts);
    playerStats.playedTurns++;
    playerStats.singles += this.getDartsMultiplierCount(game.thrownDarts, 1);
    playerStats.doubles += this.getDartsMultiplierCount(game.thrownDarts, 2);
    playerStats.triples += this.getDartsMultiplierCount(game.thrownDarts, 3);
    playerStats.misses += this.MAX_THROWS - game.thrownDarts.length;

    playerStats.totalMarks += game.thrownDarts.reduce(
      (acc, dart) => acc + dart.multiplier,
      0
    );
    playerStats.marksPerRound =
      playerStats.totalMarks / playerStats.playedTurns;

    const totalThrows = playerStats.thrownDarts.length + playerStats.misses;

    if (totalThrows > 0) {
      playerStats.marksPerDart = playerStats.totalMarks / totalThrows;
    }
  }

  private getInitialTeamStats = (): TeamsStats => ({
    playedTurns: 0,
    pointsPerRound: 0,
    totalPoints: 0,
    players: {}
  });

  private getInitialPlayerStats = (): PlayerDartsStats[string] => ({
    thrownDarts: [],
    doubles: 0,
    triples: 0,
    singles: 0,
    misses: 0,
    playedTurns: 0,
    totalMarks: 0,
    marksPerRound: 0,
    marksPerDart: 0
  });
}
