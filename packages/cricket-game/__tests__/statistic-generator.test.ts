import CricketGame from '..';
import { CricketGameInitParams } from '../game';

const PLAYER_1 = { id: '1', name: 'Player1' };
const PLAYER_2 = { id: '2', name: 'Player2' };
const PLAYER_3 = { id: '3', name: 'Player3' };
const PLAYER_4 = { id: '4', name: 'Player4' };

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

    console.log(JSON.stringify(cricketGame.teamsStats, null, 2));

    expect(cricketGame.teamsStats).toBeDefined();
  });
});
