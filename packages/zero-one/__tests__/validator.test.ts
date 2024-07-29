import { ZeroOneGame, ZeroOneGameTypeParams } from '../game';
import { ZeroOneGameValidator } from '../validator';

const PLAYER_1 = { id: '1', name: 'Player1' };
const PLAYER_2 = { id: '2', name: 'Player2' };

const gameSetup: ZeroOneGameTypeParams = {
  teams: [
    {
      id: '1',
      name: 'Team 1',
      players: [PLAYER_1]
    },
    {
      id: '2',
      name: 'Team 2',
      players: [PLAYER_2]
    }
  ],
  sets: 5,
  legs: 1,
  type: '301',
  doubleOut: false
};

describe('ZeroOneGame Validator Tests', () => {
  const zeroOneGame = new ZeroOneGame(gameSetup);

  test('should not allow score out of allowed range', () => {
    expect(ZeroOneGameValidator.isValidScore(181, zeroOneGame.game)).toBe(
      false
    );
    expect(ZeroOneGameValidator.isValidScore(-1, zeroOneGame.game)).toBe(false);
  });

  test('it should not allow throwing 3 dart impossible numbers', () => {
    for (const num of [163, 166, 169, 172, 173, 175, 176, 178, 179]) {
      expect(ZeroOneGameValidator.isValidScore(num, zeroOneGame.game)).toBe(
        false
      );
    }
  });
});
