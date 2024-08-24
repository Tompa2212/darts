import { ZeroOneGameType } from './types';

export class ZeroOneGameValidator {
  private static readonly IMPOSSIBLE_3_DARTS = new Set([
    163, 166, 169, 172, 173, 175, 176, 178, 179
  ]);

  static isValidScore(score: number, game: ZeroOneGameType) {
    if (score < 0 || score > 180) {
      return false;
    }

    if (this.IMPOSSIBLE_3_DARTS.has(score)) {
      return false;
    }

    return true;
  }

  static isBust(score: number, game: ZeroOneGameType) {
    if (game.doubleOut) {
      const remainingScore = game.currentTeam.points - score;

      return remainingScore < 0 || remainingScore === 1;
    }

    return score > game.currentTeam.points;
  }
}
