import { TeamWithPlayers } from '@/types/team';
import {
  allNums,
  checkIsFinished,
  createRandomNums,
  createScores,
  defaultNumbers
} from './helpers';
import { CricketStatisticGenerator } from './statistic-generator';
import { Game, Team, TeamWithScore, ThrownNumber } from './types';
import { CricketGameValidator } from './validator';
import { v4 as uuidv4 } from 'uuid';

const CLOSED_HIT_COUNT = 3;

export type CricketGameInitParams =
  | {
      teams: Team[];
      useRandomNums: boolean;
      numbers?: number[];
      maxRounds: number;
    }
  | { game: Game };

export class CricketGame {
  #game: Game;
  #undoStack: Game[] = [];
  #redoStack: Game[] = [];
  #statisticsGenerator = new CricketStatisticGenerator();

  constructor(params: CricketGameInitParams) {
    if ('game' in params) {
      this.#game = params.game;
    } else {
      this.#game = this.#createGame(params);
    }
  }

  get game() {
    return this.#game;
  }

  get canUndo() {
    return this.#undoStack.length > 0 && !this.#game.isFinished;
  }

  get canRedo() {
    return this.#redoStack.length > 0 && !this.#game.isFinished;
  }

  get currentTeam() {
    return this.#getCurrentTeam();
  }

  get teamsStats() {
    return this.#statisticsGenerator.getTeamsStatistic([
      ...this.#undoStack,
      this.#game
    ]);
  }

  throwDart(thrownNumber: ThrownNumber) {
    const { number, multiplier } = thrownNumber;

    if (!CricketGameValidator.canThrowDart(this.#game, thrownNumber)) {
      return;
    }

    const newState = structuredClone(this.#game);
    const team = this.#getCurrentTeam(newState);
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

    this.#game = newState;
  }

  nextPlayer() {
    this.#undoStack.push(structuredClone(this.#game));
    this.#redoStack = [];
    this.#nextPlayer();
  }

  #nextPlayer() {
    if (this.#game.isFinished) {
      return;
    }

    const currPlayerIdx = this.#getCurrentTeam().players.findIndex(
      (p) => JSON.stringify(p) === JSON.stringify(this.#game.currentPlayer)
    );

    if (currPlayerIdx === -1) {
      throw new Error('Player not found');
    }

    let nextRound = this.#game.currentRound;

    const [nextTeamIdx, nextPlayerIdx] = this.getNextTeamAndPlayerIdx();

    // count round as a new round if we've looped through one player of a each team
    if (nextTeamIdx === 0) {
      nextRound++;
    }

    if (checkIsFinished(this.#game)) {
      this.#setWinner();
    }

    this.#game = {
      ...this.#game,
      thrownDarts: [],
      currentTeam: this.#game.teams[nextTeamIdx],
      currentPlayer: this.#game.teams[nextTeamIdx].players[nextPlayerIdx],
      currentRound: nextRound,
      currentTurnPoints: 0
    };
  }

  private getNextTeamAndPlayerIdx() {
    // make it 0 indexed
    const currRound = this.#game.currentRound - 1;
    const nextRound = currRound + 1;

    const currTeamIdx = this.#game.teams.indexOf(this.#getCurrentTeam());

    const nextTeamIdx = (currTeamIdx + 1) % this.#game.teams.length;
    let nextPlayerIdx =
      nextRound % this.#game.teams[nextTeamIdx].players.length;

    if (this.#game.teams[nextTeamIdx].players[nextPlayerIdx] === undefined) {
      nextPlayerIdx = 0;
    }

    return [nextTeamIdx, nextPlayerIdx];
  }

  undoThrow() {
    if (this.#game.isFinished) {
      return;
    }

    if (this.#game.thrownDarts.length === 0) {
      return;
    }

    const newState = structuredClone(this.#game);
    const team = this.#getCurrentTeam(newState);
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

    this.#game = newState;
  }

  replayGame() {
    const newTeams = this.#game.teams.map((team) => {
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
        hitCount: createScores(this.#game.numbers),
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
    this.#game = this.#createGame({
      teams: newTeams,
      useRandomNums: this.#game.isRandomNumbers,
      numbers: this.#game.numbers,
      maxRounds: this.#game.maxRounds
    });
  }

  undoTurn() {
    if (this.#undoStack.length === 0 || this.#game.isFinished) {
      return;
    }

    this.#redoStack.push(structuredClone(this.#game));
    this.#game = this.#undoStack.pop() as Game;
    this.#clearThrows();
  }

  redoTurn() {
    if (this.#redoStack.length === 0 || this.#game.isFinished) {
      return;
    }
    this.#undoStack.push(structuredClone(this.#game));
    this.#game = this.#redoStack.pop() as Game;
  }

  #createGame({
    teams,
    numbers,
    useRandomNums = false,
    maxRounds
  }: {
    teams: Team[];
    useRandomNums: boolean;
    numbers?: number[];
    maxRounds: number;
  }): Game {
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

    const game: Game = {
      id: uuidv4(),
      teams: teamsWithScore,
      currentTeam: teamsWithScore[0],
      currentPlayer: teams[0].players[0],
      currentRound: 1,
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

  #setWinner() {
    const totalPointsTeams = this.#game.teams.map((team) => {
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

    this.#game = {
      ...this.#game,
      teams: totalPointsTeams,
      winner,
      isFinished: true
    };
  }

  #clearThrows() {
    while (this.#game.thrownDarts.length) {
      this.undoThrow();
    }
  }

  #getCurrentTeam(game?: Game) {
    if (!game) {
      game = this.#game;
    }

    return game.currentTeam;
  }
}
