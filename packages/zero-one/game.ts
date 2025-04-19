import type {
  Team,
  TeamsOutshotCombinations,
  TeamWithScore,
  ZeroOneGameType,
  ZeroOneType
} from './types';
import { v4 as uuidv4 } from 'uuid';
import { ZeroOneGameValidator } from './validator';
import { OutshotCalculator } from './outshot-calc';

type ConfiguredZeroOneGameType = {
  teams: Team[];
  type: ZeroOneType;
  sets: number;
  legs: number;
  doubleOut: boolean;
};

export type ZeroOneGameTypeParams = ConfiguredZeroOneGameType | { game: ZeroOneGameType };

export class ZeroOneGame {
  private _game: ZeroOneGameType;
  private _undoStack: ZeroOneGameType[] = [];
  private _redoStack: ZeroOneGameType[] = [];
  private _teamOutshotCombinations: TeamsOutshotCombinations = {};

  get game() {
    return this._game;
  }

  get canUndo() {
    return this._undoStack.length > 0 && !this._game.isFinished;
  }

  get canRedo() {
    return this._redoStack.length > 0 && !this._game.isFinished;
  }

  get currentTeam() {
    return this.getCurrentTeam();
  }

  get teamsOutshotCombinations() {
    const data = this._game.teams.reduce((acc, team) => {
      const savedScore = this._teamOutshotCombinations[team.id]?.score;
      const savedCombinations = this._teamOutshotCombinations[team.id]?.combinations;

      acc[team.id] = {
        score: team.score,
        combinations:
          team.score !== savedScore
            ? OutshotCalculator.findOuthsotCombinations(team.score, {
                doubleOut: this.game.doubleOut
              }).slice(0, 3)
            : savedCombinations
      };

      return acc;
    }, {} as TeamsOutshotCombinations);

    this._teamOutshotCombinations = data;
    return data;
  }

  constructor(params: ZeroOneGameTypeParams) {
    if ('game' in params) {
      this._game = params.game;
    } else {
      this._game = this.createGame(params);
    }
  }

  public enterScore(score: number) {
    if (this._game.isFinished) {
      return { error: 'Game is finished' };
    }

    if (!ZeroOneGameValidator.isValidScore(score, this._game)) {
      return { error: 'Invalid score' };
    }

    // save before adding score so that turn can be undone with correct score
    this.saveCurrentGame();

    if (ZeroOneGameValidator.isBust(score, this._game)) {
      return this.nextPlayer();
    }

    this._game.currentTeam.score -= score;

    if (!this.checkIsLegFinished()) {
      return this.nextPlayer();
    }

    this.finishLeg();

    // game can be finished only after last required leg is finished
    if (this.checkIfGameFinished()) {
      this.finishGame();
    }
  }

  private saveCurrentGame() {
    this._redoStack = [];
    this._undoStack.push(structuredClone(this._game));
  }

  private nextPlayer() {
    const newGame = structuredClone(this._game);

    newGame.roundTurnsPlayed++;
    const isNextRound = newGame.roundTurnsPlayed > newGame.teams.length;
    if (isNextRound) {
      newGame.currentRound++;
      newGame.roundTurnsPlayed = 1;
    }

    const [nextTeamIdx, nextPlayerIdx] = this.getPlayerTurn(newGame);

    this._game = {
      ...newGame,
      currentTeam: newGame.teams[nextTeamIdx],
      currentPlayer: newGame.teams[nextTeamIdx].players[nextPlayerIdx]
    };
  }

  private getPlayerTurn(game: ZeroOneGameType) {
    const { currentRound, roundTurnsPlayed, currentSet, currentLeg, teams } = game;

    let orderedTeams = this.orderTeamsByTurn(currentSet - 1, teams);
    orderedTeams = this.orderTeamsByTurn(currentLeg - 1, orderedTeams);

    const totalTurnsPlayed = (currentRound - 1) * teams.length + roundTurnsPlayed;

    return this.getStartingTeamAndPlayerIdx(totalTurnsPlayed - 1, orderedTeams);
  }

  private checkIfGameFinished() {
    const anyTeamWon = this._game.teams.some((team) => team.sets === this._game.sets);

    return anyTeamWon;
  }

  private finishGame() {
    const newGame = structuredClone(this._game);
    const winner = newGame.teams.find((team) => team.sets === newGame.sets);

    if (!winner) {
      return;
    }

    newGame.winner = winner;
    newGame.isFinished = true;

    this._game = newGame;
  }

  private checkIsLegFinished() {
    return this.getCurrentTeam().score === 0;
  }

  private finishLeg() {
    const newGame = structuredClone(this._game);
    const currTeam = this.getCurrentTeam(newGame);

    // team has won the leg
    if (currTeam.legs + 1 >= this._game.legs) {
      currTeam.legs = 0;
      currTeam.sets++;

      newGame.teams
        .filter((team) => team.id !== currTeam.id)
        .forEach((team) => {
          team.legs = 0;
        });

      newGame.currentSet++;
      newGame.currentLeg = 1;
    } else {
      currTeam.legs++;
      newGame.currentLeg++;
    }

    newGame.currentRound = 1;
    newGame.roundTurnsPlayed = 1;

    const [teamIdx, playerIdx] = this.getStartingSetLegPlayer(
      newGame.currentSet,
      newGame.currentLeg,
      newGame.teams
    );

    newGame.currentTeam = newGame.teams[teamIdx];
    newGame.currentPlayer = newGame.teams[teamIdx].players[playerIdx];

    this._game = newGame;
  }

  private getStartingSetLegPlayer(set: number, leg: number, teams: TeamWithScore[]) {
    const adjustedSet = set - 1;
    const adjustedLeg = leg - 1;

    const orderedSetTeams = this.orderTeamsByTurn(adjustedSet, teams);

    return this.getStartingTeamAndPlayerIdx(adjustedLeg, orderedSetTeams);
  }

  private orderTeamsByTurn(turn: number, teams: TeamWithScore[]) {
    const orderedTeams = [];

    for (let i = 0; i < teams.length; i++) {
      const [startedSetTeamIdx, startedSetPlayerIdx] = this.getStartingTeamAndPlayerIdx(
        turn + i,
        teams
      );
      const team = structuredClone(teams[startedSetTeamIdx]);

      team.players = [
        team.players[startedSetPlayerIdx],
        ...team.players.slice(startedSetPlayerIdx + 1),
        ...team.players.slice(0, startedSetPlayerIdx)
      ];

      orderedTeams.push(team);
    }

    return orderedTeams;
  }

  private getStartingTeamAndPlayerIdx(turn: number, teams: TeamWithScore[]) {
    const teamPlayers = structuredClone(teams.map((team) => team.players));

    const totalTeams = teamPlayers.length;
    const currTeamLength = teamPlayers[turn % totalTeams].length;
    const setRounds = Math.floor(turn / totalTeams);

    const teamIdx = turn % totalTeams;
    const palyerIdx = setRounds % currTeamLength;

    return [teamIdx, palyerIdx];
  }

  undoTurn() {
    if (this._undoStack.length === 0 || this._game.isFinished) {
      return;
    }

    this._redoStack.push(structuredClone(this._game));
    this._game = this._undoStack.pop() as ZeroOneGameType;
  }

  redoTurn() {
    if (this._redoStack.length === 0 || this._game.isFinished) {
      return;
    }
    this._undoStack.push(structuredClone(this._game));
    this._game = this._redoStack.pop() as ZeroOneGameType;
  }

  replayGame() {
    const newTeams = this._game.teams.map((team) => {
      const players = [...team.players];

      // change order of players on each replay
      const firstPlayer = players.shift();
      if (firstPlayer) {
        players.push(firstPlayer);
      }

      return {
        id: team.id,
        name: team.name,
        players,
        sets: 0,
        legs: 0,
        score: Number.parseInt(this._game.type)
      };
    });

    // change order of teams on each replay
    const firstTeam = newTeams.shift();
    if (firstTeam) {
      newTeams.push(firstTeam);
    }

    this._undoStack = [];
    this._redoStack = [];
    this._teamOutshotCombinations = {};
    this._game = this.createGame({
      teams: newTeams,
      type: this._game.type,
      sets: this._game.sets,
      legs: this._game.legs,
      doubleOut: this._game.doubleOut
    });
  }

  private createGame({ teams, type, legs, sets, doubleOut }: ConfiguredZeroOneGameType) {
    const teamsWithScore = teams.map((team) => ({
      ...team,
      score: Number.parseInt(type),
      sets: 0,
      legs: 0
    }));

    return {
      id: uuidv4(),
      type,
      teams: teamsWithScore,
      currentTeam: teamsWithScore[0],
      currentPlayer: teamsWithScore[0].players[0],
      currentRound: 1,
      sets,
      maxSets: sets + sets - 1,
      currentSet: 1,
      legs,
      currentLeg: 1,
      maxLegs: legs + legs - 1,
      roundTurnsPlayed: 1,
      winner: null,
      isFinished: false,
      doubleOut
    } as ZeroOneGameType;
  }

  private getCurrentTeam(game?: ZeroOneGameType) {
    return game ? game.currentTeam : this._game.currentTeam;
  }
}
