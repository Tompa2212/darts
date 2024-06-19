import CricketGame from '..';
import { CricketGameInitParams } from '../game';

const PLAYER_1 = { id: '1', name: 'Player1' };
const PLAYER_2 = { id: '2', name: 'Player2' };

const gameSetup: CricketGameInitParams = {
  maxRounds: 20,
  useRandomNums: false,
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
  ]
};

function throwDarts(
  game: CricketGame,
  darts: [number: number, multiplier: number][]
) {
  darts.forEach(([number, multiplier]) => {
    game.throwDart({ number, multiplier });
  });
}

describe('Statistic Generator Tests', () => {
  let cricketGame = new CricketGame(gameSetup);

  beforeEach(() => {
    cricketGame = new CricketGame(gameSetup);
  });

  it('Should generate statistics for a game', () => {
    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 3 });

    cricketGame.nextPlayer();
    cricketGame.throwDart({ number: 19, multiplier: 3 });
    cricketGame.throwDart({ number: 19, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 3 });

    cricketGame.nextPlayer();
    cricketGame.throwDart({ number: 18, multiplier: 3 });
    cricketGame.throwDart({ number: 18, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 1 });

    expect(cricketGame.teamsStats).toBeDefined();
  });

  it('Shows correct total points for teams', () => {
    //player 1
    throwDarts(cricketGame, [
      [20, 3],
      [19, 3],
      [18, 3]
    ]);

    cricketGame.nextPlayer();

    //player 2
    throwDarts(cricketGame, [
      [18, 3],
      [17, 3],
      [16, 3]
    ]);

    cricketGame.nextPlayer();

    //player 1
    throwDarts(cricketGame, [
      [20, 3],
      [17, 3],
      [16, 3]
    ]);

    cricketGame.nextPlayer();

    //player 2
    throwDarts(cricketGame, [
      [20, 3],
      [19, 3],
      [15, 3]
    ]);

    cricketGame.nextPlayer();

    //player 1
    throwDarts(cricketGame, [
      [15, 3],
      [25, 2],
      [25, 1]
    ]);

    cricketGame.nextPlayer();

    expect(cricketGame.teamsStats?.find((t) => t.id === '1')?.score).toEqual(
      20 * 3
    );

    expect(cricketGame.teamsStats?.find((t) => t.id === '2')?.score).toEqual(0);
  });
});
