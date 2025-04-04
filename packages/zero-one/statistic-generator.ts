import { PlayerDartsStats, TeamsStats, ZeroOneGameType } from './types';

export class ZeroOneStatisticGenerator {
  public calculateTeamStats(game: ZeroOneGameType) {
    const currentTeam = game.currentTeam;
    const currentPlayer = game.currentPlayer;
  }

  private getInitialTeamStats = (): TeamsStats => ({
    playedTurns: 0,
    totalScore: 0,
    averageScorePerTurn: 0,
    highestScoreInSingleTurn: 0,
    checkoutPercentage: 0,
    players: {}
  });

  private getInitialPlayerStats = (): PlayerDartsStats => ({});
}
