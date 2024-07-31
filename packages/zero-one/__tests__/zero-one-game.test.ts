import { ZeroOneGame, ZeroOneGameTypeParams } from '../game';
import { configuredGame } from './__mocks__/configured-games';

const PLAYER_1 = { id: '1', name: 'Player1' };
const PLAYER_2 = { id: '2', name: 'Player2' };
const PLAYER_3 = { id: '3', name: 'Player3' };
const PLAYER_4 = { id: '4', name: 'Player4' };
const PLAYER_5 = { id: '5', name: 'Player5' };

const gameSetup: ZeroOneGameTypeParams = {
  teams: [
    {
      id: '1',
      name: 'Team 1',
      players: [PLAYER_1, PLAYER_2]
    },
    {
      id: '2',
      name: 'Team 2',
      players: [PLAYER_3, PLAYER_4, PLAYER_5]
    }
  ],
  sets: 3,
  legs: 3,
  type: '301',
  doubleOut: false
};

describe('ZeroOneGame', () => {
  let zeroOneGame = new ZeroOneGame(gameSetup);

  beforeEach(() => {
    zeroOneGame = new ZeroOneGame(gameSetup);
  });

  test('should create a new game with correct default values', () => {
    expect(zeroOneGame.game.teams.length).toBe(2);
    expect(zeroOneGame.game.currentTeam.id).toBe(zeroOneGame.game.teams[0].id);
    expect(zeroOneGame.game.currentPlayer.id).toBe(
      zeroOneGame.game.currentTeam.players[0].id
    );
    expect(zeroOneGame.game.currentRound).toBe(1);
    expect(zeroOneGame.game.currentSet).toBe(1);
    expect(zeroOneGame.game.currentLeg).toBe(1);

    for (const team of zeroOneGame.game.teams) {
      expect(team.points).toBe(301);
      expect(team.sets).toBe(0);
      expect(team.legs).toBe(0);
    }
  });

  test('should calculate next team correctly', () => {
    let expectedOrder = ['1', '2', '1', '2', '1', '2', '1', '2'];
    function confirmOrder(game: ZeroOneGame, expectedOrder: string[]) {
      for (const expectedTeamId of expectedOrder) {
        expect(game.game.currentTeam.id).toBe(expectedTeamId);
        game.enterScore(0);
      }
    }

    confirmOrder(zeroOneGame, expectedOrder);

    // team 1
    zeroOneGame.enterScore(180);
    // team 2
    zeroOneGame.enterScore(0);
    // team 1
    zeroOneGame.enterScore(121);

    expect(zeroOneGame.game.currentTeam.id).toBe('2');
  });

  test('should calculate next player correctly', () => {
    let expectedOrder = [
      PLAYER_1,
      PLAYER_3,
      PLAYER_2,
      PLAYER_4,
      PLAYER_1,
      PLAYER_5,
      PLAYER_2,
      PLAYER_3,
      PLAYER_1
    ];

    function confirmOrder(
      game: ZeroOneGame,
      expectedOrder: {
        id: string;
        name: string;
      }[]
    ) {
      for (const expected of expectedOrder) {
        expect(game.game.currentPlayer).toEqual(expected);
        game.enterScore(0);
      }
    }

    confirmOrder(zeroOneGame, expectedOrder);
  });

  it('should calculate next player correctly on different set/leg combinations', () => {
    const gameObj = configuredGame;

    let game = new ZeroOneGame({ game: gameObj });

    game.enterScore(0);

    expect(game.game.currentPlayer).toEqual(PLAYER_2);
  });

  test('it should correctly store teams points', () => {
    expect(zeroOneGame.game.teams.find((t) => t.id === '1')?.points).toBe(301);
    zeroOneGame.enterScore(100);

    expect(zeroOneGame.game.teams.find((t) => t.id === '1')?.points).toBe(201);
  });

  test('it should notice when team wins the game', () => {
    let game = new ZeroOneGame({ ...gameSetup, sets: 1, legs: 1 });

    // team 1
    game.enterScore(180);
    //team 2
    game.enterScore(0);
    //team 1
    game.enterScore(121);

    expect(game.game.winner?.id).toBeDefined();
    expect(game.game.winner?.id).toBe('1');

    game = new ZeroOneGame({ ...gameSetup, sets: 1, legs: 2 });

    // team 1
    game.enterScore(180);
    //team 2
    game.enterScore(0);
    //team 1
    game.enterScore(121);

    // leg 2 - team 2 starts
    // team 2
    game.enterScore(180);
    // team 1
    game.enterScore(0);
    // team 2
    game.enterScore(121);

    expect(game.game.winner).toBeNull();

    // leg 3 - team 1 starts
    // team 1
    game.enterScore(180);
    // team 2
    game.enterScore(0);
    // team 1
    game.enterScore(121);

    expect(game.game.winner?.id).toBeDefined();
    expect(game.game.winner?.id).toBe('1');
  });
});
