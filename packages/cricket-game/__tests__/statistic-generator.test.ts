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

function throwDarts(game: CricketGame, darts: [number: number, multiplier: number][]) {
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
    throwDarts(cricketGame, [
      [20, 3],
      [20, 3],
      [20, 3]
    ]);

    cricketGame.nextPlayer();
    throwDarts(cricketGame, [
      [19, 3],
      [19, 3],
      [20, 3]
    ]);

    cricketGame.nextPlayer();
    throwDarts(cricketGame, [
      [18, 3],
      [18, 3],
      [20, 1]
    ]);

    cricketGame.game.teams.forEach((team) => {
      expect(team.stats).toBeDefined();
    });
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

    expect(cricketGame.game.teams.find((t) => t.id === '1')?.stats?.totalPoints).toEqual(20 * 3);

    expect(cricketGame.game.teams.find((t) => t.id === '2')?.stats?.totalPoints).toEqual(0);
  });

  it('Calculates correct marks stats for players', () => {
    // player 1
    throwDarts(cricketGame, [
      [20, 3],
      [19, 3],
      [18, 3]
    ]);
    cricketGame.nextPlayer();

    // player 2
    throwDarts(cricketGame, [
      [18, 3],
      [17, 3],
      [16, 3]
    ]);
    cricketGame.nextPlayer();

    // player 1
    throwDarts(cricketGame, [[19, 3]]);
    cricketGame.nextPlayer();

    // player 2
    throwDarts(cricketGame, [[18, 3]]);
    cricketGame.nextPlayer();

    const game = cricketGame.game;
    const team1 = game.teams.find((t) => t.id === '1');
    const team2 = game.teams.find((t) => t.id === '2');

    expect(team1?.stats?.players[PLAYER_1.name].totalMarks).toEqual(12);
    expect(team2?.stats?.players[PLAYER_2.name].totalMarks).toEqual(9);

    expect(team1?.stats?.players[PLAYER_1.name].marksPerRound).toEqual(6);
    expect(team2?.stats?.players[PLAYER_2.name].marksPerRound).toEqual(4.5);

    // misses are also counted, so 3 darts are always "thrown" per turn
    expect(team1?.stats?.players[PLAYER_1.name].marksPerDart).toEqual(2);
    expect(team2?.stats?.players[PLAYER_2.name].marksPerDart).toEqual(1.5);
  });

  it('Calculates correct darts stats for players', () => {
    // player 1
    throwDarts(cricketGame, [
      [20, 3],
      [19, 3],
      [18, 3]
    ]);
    cricketGame.nextPlayer();

    // player 2
    throwDarts(cricketGame, [
      [18, 3],
      [17, 3],
      [16, 3]
    ]);
    cricketGame.nextPlayer();

    // player 1
    throwDarts(cricketGame, [
      [19, 3],
      [25, 2]
    ]);
    cricketGame.nextPlayer();

    // player 2
    throwDarts(cricketGame, [[18, 3]]);
    cricketGame.nextPlayer();

    const game = cricketGame.game;

    const player1 = game.teams.find((t) => t.id === '1')?.stats?.players[PLAYER_1.name]!;
    const player2 = game.teams.find((t) => t.id === '2')?.stats?.players[PLAYER_2.name]!;

    expect(player1.singles).toEqual(0);
    expect(player1.doubles).toEqual(1);
    expect(player1.triples).toEqual(4);
    expect(player1.misses).toEqual(1);

    expect(player2.singles).toEqual(0);
    expect(player2.doubles).toEqual(0);
    expect(player2.triples).toEqual(3);
    expect(player2.misses).toEqual(3);
  });
});
