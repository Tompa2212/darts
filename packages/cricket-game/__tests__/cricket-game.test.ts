import CricketGame from '@/packages/cricket-game';
import type { CricketGameInitParams } from '../game';

const PLAYER_1 = { id: '1', name: 'Player1' };
const PLAYER_2 = { id: '2', name: 'Player2' };
const PLAYER_3 = { id: '3', name: 'Player3' };
const PLAYER_4 = { id: '4', name: 'Player4' };
const PLAYER_5 = { id: '5', name: 'Player5' };

const gameSetup: CricketGameInitParams = {
  maxRounds: 300,
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

function throwDarts(game: CricketGame, darts: [number: number, multiplier: number][]) {
  darts.forEach(([number, multiplier]) => {
    game.throwDart({ number, multiplier });
  });
}

describe('Cricket Game', () => {
  let cricketGame: CricketGame;

  function confirmOrder(
    game: CricketGame,
    expectedOrder: {
      id: string;
      name: string;
    }[]
  ) {
    for (const player of expectedOrder) {
      expect(game.game.currentPlayer).toEqual(player);
      game.nextPlayer();
    }
  }

  beforeEach(() => {
    cricketGame = new CricketGame(gameSetup);
  });

  it('Shows current turn points correctly', () => {
    expect(cricketGame.game.currentTurnPoints).toBe(0);

    throwDarts(cricketGame, [
      [20, 3],
      [20, 3]
    ]);

    expect(cricketGame.game.currentTurnPoints).toBe(60);

    cricketGame.undoThrow();
    throwDarts(cricketGame, [[20, 2]]);

    expect(cricketGame.game.currentTurnPoints).toBe(40);

    cricketGame.nextPlayer();

    expect(cricketGame.game.currentTurnPoints).toBe(0);

    throwDarts(cricketGame, [[17, 3]]);

    expect(cricketGame.game.currentTurnPoints).toBe(0);

    throwDarts(cricketGame, [[17, 3]]);
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
    throwDarts(cricketGame, [
      [20, 3],
      [20, 3],
      [20, 3]
    ]);

    expect(cricketGame.game.teams[0].points).toBe(120);
    cricketGame.undoThrow();
    expect(cricketGame.game.teams[0].points).toBe(60);

    cricketGame.nextPlayer();
    cricketGame.nextPlayer();

    throwDarts(cricketGame, [
      [20, 1],
      [17, 3],
      [17, 2]
    ]);

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

    let expectedOrder = [
      PLAYER_1,
      PLAYER_3,
      PLAYER_2,
      PLAYER_3,
      PLAYER_1,
      PLAYER_3,
      PLAYER_2,
      PLAYER_3,
      PLAYER_1
    ];

    confirmOrder(cricketGame, expectedOrder);

    cricketGame = new CricketGame(gameSetup);
    expectedOrder = [
      PLAYER_1,
      PLAYER_2,
      PLAYER_1,
      PLAYER_2,
      PLAYER_1,
      PLAYER_2,
      PLAYER_1,
      PLAYER_2
    ];

    confirmOrder(cricketGame, expectedOrder);

    cricketGame = new CricketGame({
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
          players: [PLAYER_3, PLAYER_4]
        }
      ]
    });

    expectedOrder = [
      PLAYER_1,
      PLAYER_3,
      PLAYER_2,
      PLAYER_4,
      PLAYER_1,
      PLAYER_3,
      PLAYER_2,
      PLAYER_4
    ];
    confirmOrder(cricketGame, expectedOrder);

    cricketGame = new CricketGame({
      ...gameSetup,
      teams: [
        {
          id: '1',
          name: 'Team 1',
          players: [PLAYER_1]
        },
        {
          id: '2',
          name: 'Team 2',
          players: [PLAYER_2, PLAYER_3]
        }
      ]
    });

    expectedOrder = [
      PLAYER_1,
      PLAYER_2,
      PLAYER_1,
      PLAYER_3,
      PLAYER_1,
      PLAYER_2,
      PLAYER_1,
      PLAYER_3,
      PLAYER_1,
      PLAYER_2
    ];
    confirmOrder(cricketGame, expectedOrder);

    cricketGame = new CricketGame({
      ...gameSetup,
      teams: [
        {
          id: '1',
          name: 'Team 1',
          players: [PLAYER_1]
        },
        {
          id: '2',
          name: 'Team 2',
          players: [PLAYER_2, PLAYER_3]
        },
        {
          id: '3',
          name: 'Team 3',
          players: [PLAYER_4, PLAYER_5]
        }
      ]
    });

    expectedOrder = [
      PLAYER_1,
      PLAYER_2,
      PLAYER_4,
      PLAYER_1,
      PLAYER_3,
      PLAYER_5,
      PLAYER_1,
      PLAYER_2,
      PLAYER_4
    ];
    confirmOrder(cricketGame, expectedOrder);
  });

  it('Disables numbers correctly', () => {
    cricketGame.throwDart({ number: 20, multiplier: 3 });
    cricketGame.nextPlayer();
    cricketGame.throwDart({ number: 20, multiplier: 3 });

    expect(cricketGame.game.closedNumbers.has(20)).toBe(true);
    cricketGame.undoThrow();
    expect(cricketGame.game.closedNumbers.has(20)).toBe(false);
  });

  it('Notices when game is finished', () => {
    throwDarts(cricketGame, [
      [20, 3],
      [20, 3],
      [19, 3]
    ]);

    expect(cricketGame.game.isFinished).toBe(false);

    cricketGame.nextPlayer();
    throwDarts(cricketGame, [
      [19, 3],
      [18, 3]
    ]);

    cricketGame.nextPlayer();
    throwDarts(cricketGame, [
      [18, 3],
      [17, 3],
      [16, 3]
    ]);

    cricketGame.nextPlayer();

    throwDarts(cricketGame, [
      [20, 3],
      [19, 3],
      [18, 3]
    ]);

    cricketGame.nextPlayer();
    throwDarts(cricketGame, [
      [15, 3],
      [25, 2],
      [25, 1]
    ]);
    cricketGame.nextPlayer();

    expect(cricketGame.game.winner).not.toBeNull();
    expect(cricketGame.game.isFinished).toBe(true);
  });

  it('Sums up all points correctly after game is finished', () => {
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

    const game = cricketGame.game;
    expect(game.winner).toBeDefined();
    expect(game.winner).toBe(game.teams[0]);

    const allNumbersClosedPoints = game.numbers.map((n) => n * 3).reduce((a, b) => a + b, 0);

    expect(game.teams[0].points).toBe(allNumbersClosedPoints + 20 * 3);
    // player 2 didnt close bullseye and had 0 points
    expect(game.teams[1].points).toBe(allNumbersClosedPoints - 25 * 3);
  });
});
