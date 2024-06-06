import CricketGame from '@/packages/cricket-game';
import { CricketGameInitParams } from '../game';

const PLAYER_1 = { id: '1', name: 'Player1' };
const PLAYER_2 = { id: '2', name: 'Player2' };
const PLAYER_3 = { id: '3', name: 'Player3' };

const gameSetup: CricketGameInitParams = {
  maxRounds: 3,
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

describe('Cricket Game', () => {
  it('Shows current turn points correctly', () => {
    const cricketGame = new CricketGame(gameSetup);

    expect(cricketGame.game.currentTurnPoints).toBe(0);

    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 3 });

    expect(cricketGame.game.currentTurnPoints).toBe(60);

    cricketGame.undoThrow();
    cricketGame.throwDart({ number: 20, multiplier: 2 });
    expect(cricketGame.game.currentTurnPoints).toBe(40);

    cricketGame.nextPlayer();

    expect(cricketGame.game.currentTurnPoints).toBe(0);

    cricketGame.throwDart({ number: 17, multiplier: 3 });
    expect(cricketGame.game.currentTurnPoints).toBe(0);

    cricketGame.throwDart({ number: 17, multiplier: 3 });
    expect(cricketGame.game.currentTurnPoints).toBe(17 * 3);

    cricketGame.nextPlayer();

    cricketGame.throwDart({ number: 17, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 3 });
    // 17 is disabled now, no points should be added
    cricketGame.throwDart({ number: 17, multiplier: 2 });

    expect(cricketGame.game.closedNumbers.has(17)).toBe(true);
    expect(cricketGame.game.currentTurnPoints).toBe(20 * 3);
  });

  it('Calculates points correctly', () => {
    const cricketGame = new CricketGame(gameSetup);

    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 3 });

    expect(cricketGame.game.teams[0].points).toBe(120);
    cricketGame.undoThrow();
    expect(cricketGame.game.teams[0].points).toBe(60);

    cricketGame.nextPlayer();
    cricketGame.nextPlayer();

    cricketGame.throwDart({ number: 20, multiplier: 1 });
    cricketGame.throwDart({ number: 17, multiplier: 3 });
    cricketGame.throwDart({ number: 17, multiplier: 2 });

    cricketGame.nextPlayer();

    expect(cricketGame.game.teams[0].points).toBe(80 + 17 * 2);
    expect(cricketGame.game.teams[1].points).toBe(0);

    cricketGame.undoTurn();
    expect(cricketGame.game.teams[0].points).toBe(60);

    cricketGame.redoTurn();
    expect(cricketGame.game.teams[0].points).toBe(80 + 17 * 2);
  });

  it('Calculates next player correctly', () => {
    let cricketGame = new CricketGame({
      ...gameSetup,
      teams: [
        {
          id: '1',
          name: 'Team 1',
          players: [PLAYER_1, PLAYER_2]
        },
        {
          id: '2',
          name: 'Team 2',
          players: [PLAYER_3]
        }
      ]
    });

    expect(cricketGame.game.currentPlayer).toBe(PLAYER_1);

    cricketGame.nextPlayer();
    expect(cricketGame.game.currentPlayer).toBe(PLAYER_3);

    cricketGame.nextPlayer();
    expect(cricketGame.game.currentPlayer).toBe(PLAYER_2);

    cricketGame.nextPlayer();
    expect(cricketGame.game.currentPlayer).toBe(PLAYER_3);

    cricketGame.nextPlayer();
    expect(cricketGame.game.currentPlayer).toBe(PLAYER_1);

    cricketGame = new CricketGame(gameSetup);
    expect(cricketGame.game.currentPlayer).toBe(PLAYER_1);
    cricketGame.nextPlayer();
    expect(cricketGame.game.currentPlayer).toBe(PLAYER_2);
    cricketGame.nextPlayer();
    expect(cricketGame.game.currentPlayer).toBe(PLAYER_1);
  });

  it('Disables numbers correctly', () => {
    const cricketGame = new CricketGame(gameSetup);

    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.nextPlayer();
    cricketGame.throwDart({ number: 20, multiplier: 3 });

    expect(cricketGame.game.closedNumbers.has(20)).toBe(true);
    cricketGame.undoThrow();
    expect(cricketGame.game.closedNumbers.has(20)).toBe(false);
  });

  it('Notices when game is finished', () => {
    const cricketGame = new CricketGame(gameSetup);

    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.throwDart({ number: 19, multiplier: 3 });

    expect(cricketGame.game.isFinished).toBe(false);

    cricketGame.nextPlayer();
    cricketGame.throwDart({ number: 19, multiplier: 3 });
    cricketGame.throwDart({ number: 18, multiplier: 3 });

    cricketGame.nextPlayer();
    cricketGame.throwDart({ number: 18, multiplier: 3 });
    cricketGame.throwDart({ number: 17, multiplier: 3 });
    cricketGame.throwDart({ number: 16, multiplier: 3 });

    cricketGame.nextPlayer();

    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.throwDart({ number: 19, multiplier: 3 });
    cricketGame.throwDart({ number: 18, multiplier: 3 });

    cricketGame.nextPlayer();
    cricketGame.throwDart({ number: 15, multiplier: 3 });
    cricketGame.throwDart({ number: 25, multiplier: 2 });
    cricketGame.throwDart({ number: 25, multiplier: 1 });
    cricketGame.nextPlayer();

    expect(cricketGame.game.winner).not.toBeNull();
    expect(cricketGame.game.isFinished).toBe(true);
  });
});
