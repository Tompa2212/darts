import type { CricketGameType } from '.';
import type { ThrownNumber } from './types';

export class CricketGameValidator {
  static canThrowDart(
    game: Pick<
      CricketGameType,
      'isFinished' | 'closedNumbers' | 'thrownDarts' | 'currentRound' | 'maxRounds' | 'numbers'
    >,
    { number, multiplier }: ThrownNumber
  ) {
    if (
      game.isFinished ||
      game.closedNumbers.has(number) ||
      game.thrownDarts.length + 1 > 3 ||
      game.currentRound > game.maxRounds
    ) {
      return false;
    }

    // Bullseye can't be triple
    if (number === 25 && multiplier === 3) {
      return false;
    }

    if (multiplier < 1 || multiplier > 3) {
      return false;
    }

    if (!game.numbers.includes(number)) {
      return false;
    }

    return true;
  }
}
