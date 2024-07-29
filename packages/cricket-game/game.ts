import {
  allNums,
  checkIsFinished,
  createRandomNums,
  createScores,
  defaultNumbers
} from './helpers';
import { CricketStatisticGenerator } from './statistic-generator';
import { Team, TeamWithScore, ThrownNumber } from './types';
import { CricketGameValidator } from './validator';
import { v4 as uuidv4 } from 'uuid';
import { CricketGameType } from '.';

const CLOSED_HIT_COUNT = 3;

export type CricketGameInitParams =
  | {
      teams: Team[];
      useRandomNums: boolean;
      numbers?: number[];
      maxRounds: number;
    }
  | { game: CricketGameType };

export class CricketGame {
  private _game: CricketGameType;
  #undoStack: CricketGameType[] = [];
  #redoStack: CricketGameType[] = [];

  #statisticsGenerator = new CricketStatisticGenerator();

  constructor(params: CricketGameInitParams) {
    if ('game' in params) {
      this._game = params.game;
    } else {
      this._game = this.createGame(params);
    }
  }

  get game() {
    return this._game;
  }

  get canUndo() {
    return this.#undoStack.length > 0 && !this._game.isFinished;
  }

  get canRedo() {
    return this.#redoStack.length > 0 && !this._game.isFinished;
  }

  get currentTeam() {
    return this.getCurrentTeam();
  }

  throwDart(thrownNumber: ThrownNumber) {
    const { number, multiplier } = thrownNumber;

    if (!CricketGameValidator.canThrowDart(this._game, thrownNumber)) {
      return;
    }

    const newState = structuredClone(this._game);
    const team = this.getCurrentTeam(newState);
    const teamPointsBeforeThrow = team.points;

    // Hit count represents how many times a number has been hit, triple counts as 3 hits
    const oldHidCount = team.hitCount[number];
    const newHitCount = team.hitCount[number] + multiplier;

    team.hitCount[number] += multiplier;

    const currNumHits = newState.teams.map((t) => t.hitCount[number]);
    const isDisabled = currNumHits.every((hits) => hits >= CLOSED_HIT_COUNT);

    if (isDisabled) {
      newState.closedNumbers.add(number);
    } else if (newHitCount > CLOSED_HIT_COUNT) {
      const oldCountDiffToClosed = CLOSED_HIT_COUNT - oldHidCount;

      if (oldCountDiffToClosed <= 0) {
        team.points += number * multiplier;
      } else {
        team.points += number * Math.max(0, multiplier - oldCountDiffToClosed);
      }
    }

    const thrownDart = {
      ...thrownNumber,
      points: team.points - teamPointsBeforeThrow,
      closed: oldHidCount < CLOSED_HIT_COUNT && newHitCount >= CLOSED_HIT_COUNT
    };

    newState.thrownDarts.push(thrownDart);
    newState.currentTurnPoints =
      newState.currentTurnPoints + (team.points - teamPointsBeforeThrow);

    this._game = newState;
  }

  nextPlayer() {
    this.#statisticsGenerator.calculateTeamStats(this._game);
    this.#undoStack.push(structuredClone(this._game));
    this.#redoStack = [];
    this.__nextPlayer();
  }

  private __nextPlayer() {
    if (this._game.isFinished) {
      return;
    }

    const newGame = structuredClone(this._game);

    newGame.currentRoundTurns++;
    const isNextRound = newGame.currentRoundTurns > newGame.teams.length;
    if (isNextRound) {
      newGame.currentRound++;
      newGame.currentRoundTurns = 1;
    }

    if (checkIsFinished(newGame)) {
      return this.setWinner(newGame);
    }

    const [nextTeamIdx, nextPlayerIdx] = this.getNextTeamAndPlayerIdx(newGame);

    this._game = {
      ...newGame,
      thrownDarts: [],
      currentTeam: newGame.teams[nextTeamIdx],
      currentPlayer: newGame.teams[nextTeamIdx].players[nextPlayerIdx],
      currentTurnPoints: 0
    };
  }

  private getNextTeamAndPlayerIdx(game: CricketGameType) {
    const teams = game.teams;
    const round = game.currentRound;
    const playedTurns = game.currentRoundTurns;

    const nextPlayer = this.roundRobin(round - 1, playedTurns - 1, game.teams);
    const nextTeamIdx = teams.findIndex((t) =>
      t.players.find((p) => p.name === nextPlayer.name)
    );
    const nextPlayerIdx = teams[nextTeamIdx].players.findIndex(
      (p) => p.name === nextPlayer.name
    );

    return [nextTeamIdx, nextPlayerIdx];
  }

  private roundRobin(round: number, turn: number, teams: TeamWithScore[]) {
    const teamPlayers = structuredClone(teams.map((team) => team.players));
    const totalTeams = teamPlayers.length;
    const currTeamLength = teamPlayers[turn % totalTeams].length;

    return teamPlayers[turn % totalTeams][round % currTeamLength];
  }

  undoThrow() {
    if (this._game.isFinished) {
      return;
    }

    if (this._game.thrownDarts.length === 0) {
      return;
    }

    const newState = structuredClone(this._game);
    const team = this.getCurrentTeam(newState);
    const teamPointsBeforeUndo = team.points;

    const { number: lastDart = 0, multiplier = 0 } =
      newState.thrownDarts.pop() || {};
    const points = lastDart * multiplier;

    if (lastDart) {
      if (team.hitCount[lastDart] > CLOSED_HIT_COUNT) {
        team.points = Math.max(0, team.points - points);
      }

      team.hitCount[lastDart] -= multiplier;
      team.hitCount[lastDart] = Math.max(0, team.hitCount[lastDart]);

      if (team.hitCount[lastDart] < CLOSED_HIT_COUNT) {
        newState.closedNumbers.delete(lastDart);
      }
    }

    newState.currentTurnPoints = Math.max(
      team.points - teamPointsBeforeUndo,
      0
    );

    this._game = newState;
  }

  replayGame() {
    const newTeams = this._game.teams.map((team) => {
      const players = [...team.players];

      // change order of players on each replay
      const lastPlayer = players.pop();
      if (lastPlayer) {
        players.unshift(lastPlayer);
      }

      return {
        id: team.id,
        name: team.name,
        players,
        hitCount: createScores(this._game.numbers),
        points: 0
      };
    });

    // change order of teams on each replay
    const lastTeam = newTeams.pop();
    if (lastTeam) {
      newTeams.unshift(lastTeam);
    }

    this.#undoStack = [];
    this.#redoStack = [];
    this._game = this.createGame({
      teams: newTeams,
      useRandomNums: this._game.isRandomNumbers,
      numbers: this._game.numbers,
      maxRounds: this._game.maxRounds
    });
  }

  undoTurn() {
    if (this.#undoStack.length === 0 || this._game.isFinished) {
      return;
    }

    this.#redoStack.push(structuredClone(this._game));
    this._game = this.#undoStack.pop() as CricketGameType;
    this.clearThrows();
  }

  redoTurn() {
    if (this.#redoStack.length === 0 || this._game.isFinished) {
      return;
    }
    this.#undoStack.push(structuredClone(this._game));
    this._game = this.#redoStack.pop() as CricketGameType;
  }

  private createGame({
    teams,
    numbers,
    useRandomNums = false,
    maxRounds
  }: {
    teams: Team[];
    useRandomNums: boolean;
    numbers?: number[];
    maxRounds: number;
  }): CricketGameType {
    if (useRandomNums) {
      numbers = createRandomNums();
    } else {
      numbers = numbers || defaultNumbers;

      if (numbers.length !== 7) {
        throw new Error('Invalid numbers length');
      }

      numbers.forEach((num) => {
        if (!allNums.includes(num)) {
          throw new Error('Invalid number provided: ' + num);
        }
      });
    }
    const teamsWithScore = teams.map((team) => ({
      ...team,
      hitCount: createScores(numbers),
      points: 0
    }));

    const game: CricketGameType = {
      id: uuidv4(),
      teams: teamsWithScore,
      currentTeam: teamsWithScore[0],
      currentPlayer: teamsWithScore[0].players[0],
      currentRound: 1,
      currentRoundTurns: 1,
      currentTurnPoints: 0,
      isFinished: false,
      isRandomNumbers: useRandomNums,
      winner: null,
      closedNumbers: new Set<number>(),
      numbers,
      maxRounds,
      thrownDarts: []
    };

    return game;
  }

  private setWinner(game?: CricketGameType) {
    game = game || this._game;

    const totalPointsTeams = game.teams.map((team) => {
      let points = team.points;

      Object.entries(team.hitCount).forEach(([num, hitCount]) => {
        if (hitCount >= CLOSED_HIT_COUNT) {
          points += parseInt(num) * Math.min(CLOSED_HIT_COUNT, hitCount);
        }
      });

      return {
        ...team,
        points
      };
    });

    const winner = totalPointsTeams.toSorted((a, b) => b.points - a.points)[0];

    this._game = {
      ...game,
      teams: totalPointsTeams,
      winner,
      isFinished: true
    };

    return this._game;
  }

  private clearThrows() {
    while (this._game.thrownDarts.length) {
      this.undoThrow();
    }
  }

  private getCurrentTeam(game?: CricketGameType) {
    if (!game) {
      game = this._game;
    }

    return game.currentTeam;
  }
}
