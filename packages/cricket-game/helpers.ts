import { Game } from './types';

export const allNums = [
  25, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
];
export const defaultNumbers = [20, 19, 18, 17, 16, 15, 25];

export function createRandomNums() {
  const nums = new Set<number>();

  while (nums.size < 7) {
    nums.add(allNums[Math.floor(Math.random() * allNums.length)]);
  }

  return Array.from(nums).sort((a, b) => b - a);
}

export function createScores(nums: number[]) {
  return nums.reduce((acc, num) => {
    acc[num] = 0;
    return acc;
  }, {} as Record<string, number>);
}

export function checkIsFinished(game: Game) {
  if (game.currentRound > game.maxRounds && game.maxRounds !== null) {
    return true;
  }

  // if some team closed all numbers and has more or equal points than others
  // game is finished, and winner is that team
  if (
    game.teams.some((team, _idx, arr) => {
      const teamClosedAllNums = Object.values(team.hitCount).every(
        (hits) => hits >= 3
      );

      if (teamClosedAllNums) {
        return arr
          .filter((_, idx) => _idx !== idx)
          .every((t) => t.points <= team.points);
      }

      return false;
    })
  ) {
    return true;
  }

  return game.teams.every((team) =>
    Object.values(team.hitCount).every((hits) => hits >= 3)
  );
}
