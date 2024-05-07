export class CricketGameValidator {
  static isValidDartsCombination(darts: number[]) {
    if (darts.length > 9) {
      return false;
    }

    const count = darts.reduce<Record<number, number>>((acc, dart) => {
      acc[dart] = (acc[dart] || 0) + 1;
      return acc;
    }, {});

    const uniqueDarts = Object.keys(count).length;

    if (uniqueDarts > 3) {
      return false;
    }

    if (uniqueDarts === 3 && this.#isSomeCountAbove(count, 3)) {
      return false;
    }

    if (uniqueDarts === 2 && this.#isSomeCountAbove(count, 6)) {
      return false;
    }

    // validate with bullseye
    if (count[25]) {
      const { 25: bullCount, ...countNoBull } = structuredClone(count);

      if (bullCount > 6) {
        return false;
      }

      if (bullCount >= 5 && uniqueDarts === 2) {
        return false;
      }

      if (bullCount >= 3) {
        if (uniqueDarts > 2) {
          return false;
        }

        if (this.#isSomeCountAbove(countNoBull, 3)) {
          return false;
        }
      }

      if (uniqueDarts === 2 && this.#isSomeCountAbove(countNoBull, 6)) {
        return false;
      }

      if (uniqueDarts === 3 && this.#isSomeCountAbove(countNoBull, 3)) {
        return false;
      }
    }

    return true;
  }

  static #isSomeCountAbove(count: Record<string, number>, threshold: number) {
    return Object.values(count).some((c) => c > threshold);
  }
}
