import {
  allNums,
  checkIsFinished,
  createRandomNums,
  createScores,
  defaultNumbers
} from './helpers';
import { Game, Team } from './types';
import { CricketGameValidator } from './validator';

const CLOSED_HIT_COUNT = 3;

type CricketGameInitParams = {
  teams: Team[];
  useRandomNums: boolean;
  numbers?: number[];
  maxRounds: number;
};

export class CricketGame {
  #game: Game;
  #undoStack: Game[] = [];
  #redoStack: Game[] = [];

  constructor({
    teams,
    useRandomNums = false,
    numbers = defaultNumbers,
    maxRounds
  }: CricketGameInitParams) {
    this.#game = this.#createGame({ teams, useRandomNums, numbers, maxRounds });
  }

  get game() {
    return this.#game;
  }

  get canUndo() {
    return this.#undoStack.length > 0;
  }

  get canRedo() {
    return this.#redoStack.length > 0;
  }

  get currentTeam() {
    return this.#getCurrentTeam();
  }

  throwDart(num: number) {
    if (this.#game.isFinished) {
      return;
    }

    if (this.#game.disabledNumbers.has(num)) {
      return;
    }

    if (
      !CricketGameValidator.isValidDartsCombination([
        ...this.#game.thrownDarts,
        num
      ])
    ) {
      return;
    }

    const newState = structuredClone(this.#game);
    const team = this.#getCurrentTeam(newState);

    newState.thrownDarts.push(num);

    if (team.hitCount[num] >= CLOSED_HIT_COUNT) {
      team.points += num;
    }

    team.hitCount[num]++;

    const currNumHits = newState.teams.map((t) => t.hitCount[num]);
    const isDisabled = currNumHits.every((hits) => hits >= CLOSED_HIT_COUNT);

    if (isDisabled) {
      newState.disabledNumbers.add(num);
    }

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

    const nextTeamIdx = (this.#game.currentTeam + 1) % this.#game.teams.length;
    let nextPlayerIdx = currPlayerIdx;
    let nextRound = this.#game.currentRound;

    if (nextTeamIdx === 0) {
      nextPlayerIdx = (currPlayerIdx + 1) % this.#game.teams[0].players.length;
    }

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
      currentTeam: nextTeamIdx,
      currentPlayer: this.#game.teams[nextTeamIdx].players[nextPlayerIdx],
      currentRound: nextRound
    };
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

    const lastDart = newState.thrownDarts.pop();
    if (lastDart) {
      if (team.hitCount[lastDart] > CLOSED_HIT_COUNT) {
        team.points = Math.max(0, team.points - lastDart);
      }

      team.hitCount[lastDart] = Math.max(0, --team.hitCount[lastDart]);

      if (team.hitCount[lastDart] < CLOSED_HIT_COUNT) {
        newState.disabledNumbers.delete(lastDart);
      }
    }

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
      useRandomNums: this.game.isRandomNumbers,
      numbers: this.#game.numbers,
      maxRounds: this.#game.maxRounds
    });
  }

  undoTurn() {
    if (this.#undoStack.length === 0) {
      return;
    }
    this.#redoStack.push(structuredClone(this.game));
    this.#game = this.#undoStack.pop() as Game;
    this.#clearThrows();
  }

  redoTurn() {
    if (this.#redoStack.length === 0) {
      return;
    }
    this.#undoStack.push(structuredClone(this.game));
    this.#game = this.#redoStack.pop() as Game;
  }

  #createGame({
    teams,
    numbers,
    useRandomNums = false,
    maxRounds
  }: CricketGameInitParams): Game {
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

    const game: Game = {
      teams: teams.map((team) => ({
        ...team,
        hitCount: createScores(numbers),
        points: 0
      })),
      currentTeam: 0,
      currentPlayer: teams[0].players[0],
      currentRound: 1,
      isFinished: false,
      isRandomNumbers: useRandomNums,
      winner: null,
      disabledNumbers: new Set<number>(),
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

    return game.teams[game.currentTeam];
  }
}
