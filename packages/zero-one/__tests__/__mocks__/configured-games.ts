import { ZeroOneGameType } from '../../types';

export const configuredGame: ZeroOneGameType = {
  id: '936ed7ca-6723-4d3a-b72a-11672c9d0975',
  type: '301',
  teams: [
    {
      id: '1',
      name: 'Team 1',
      players: [
        { id: '1', name: 'Player1' },
        { id: '2', name: 'Player2' }
      ],
      score: 301,
      sets: 0,
      legs: 1
    },
    {
      id: '2',
      name: 'Team 2',
      players: [
        { id: '3', name: 'Player3' },
        { id: '4', name: 'Player4' },
        { id: '5', name: 'Player5' }
      ],
      score: 301,
      sets: 0,
      legs: 1
    }
  ],
  currentTeam: {
    id: '1',
    name: 'Team 1',
    players: [
      { id: '1', name: 'Player1' },
      { id: '2', name: 'Player2' }
    ],
    score: 301,
    sets: 0,
    legs: 1
  },
  currentPlayer: { id: '2', name: 'Player2' },
  currentRound: 1,
  sets: 3,
  maxSets: 5,
  currentSet: 1,
  legs: 3,
  currentLeg: 3,
  maxLegs: 5,
  roundTurnsPlayed: 2,
  winner: null,
  isFinished: false,
  doubleOut: false
};
