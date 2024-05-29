import { CricketGameValidator } from '../validator';
import { CricketGameInit } from '@/types/client/cricket';
import CricketGame from '..';

const PLAYER_1 = { id: '1', name: 'Player1' };
const PLAYER_2 = { id: '2', name: 'Player2' };

const gameSetup: CricketGameInit = {
  maxRounds: 3,
  useRandomNums: false,
  teams: [
    {
      name: 'Team 1',
      players: [PLAYER_1]
    },
    {
      name: 'Team 2',
      players: [PLAYER_2]
    }
  ]
};

describe('Cricket Game Validator', () => {
  let cricketGame = new CricketGame(gameSetup);

  beforeEach(() => {
    cricketGame = new CricketGame(gameSetup);
  });

  it('Should not allow triple bullseye', () => {
    expect(
      CricketGameValidator.canThrowDart(cricketGame.game, {
        number: 25,
        multiplier: 3
      })
    ).toBe(false);
  });

  it('Should not allow more than 3 darts thrown', () => {
    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 3 });

    expect(
      CricketGameValidator.canThrowDart(cricketGame.game, {
        number: 25,
        multiplier: 3
      })
    ).toBe(false);
  });

  it('Should not allow invalid multipliers', () => {
    expect(
      CricketGameValidator.canThrowDart(cricketGame.game, {
        number: 25,
        multiplier: 4
      })
    ).toBe(false);
  });

  it('Should not allow throwing dart if the dart number is not contained in game numbers', () => {
    expect(
      CricketGameValidator.canThrowDart(cricketGame.game, {
        number: 35,
        multiplier: 3
      })
    ).toBe(false);
  });

  it('Should not allow throwning dart if number is disabled', () => {
    cricketGame.throwDart({ number: 17, multiplier: 3 });
    cricketGame.nextPlayer();
    cricketGame.throwDart({ number: 17, multiplier: 3 });

    expect(
      CricketGameValidator.canThrowDart(cricketGame.game, {
        number: 17,
        multiplier: 1
      })
    ).toBe(false);
  });

  it('Should not allow throwning dart if game is finished', () => {
    cricketGame.game.isFinished = true;

    expect(
      CricketGameValidator.canThrowDart(cricketGame.game, {
        number: 17,
        multiplier: 1
      })
    ).toBe(false);
  });
});
