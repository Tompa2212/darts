import { Dart } from './types';

const allNums = [
  25, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
];

const allDartsCombinations = allNums.flatMap((num) => {
  if (num === 25) {
    return [
      { value: num, multiplier: 2 },
      { value: num, multiplier: 1 }
    ];
  }

  return [
    { value: num, multiplier: 3 },
    { value: num, multiplier: 2 },
    { value: num, multiplier: 1 }
  ];
});

type CheckoutOptions = {
  doubleOut?: boolean;
  mastersOut?: boolean;
};

export class OutshotCalculator {
  public static findOuthsotCombinations(
    score: number,
    checkoutOptions?: CheckoutOptions
  ) {
    let validCheckoutMultipliers = [1, 2, 3];

    if (checkoutOptions?.doubleOut) {
      validCheckoutMultipliers = [2];
    }
    if (checkoutOptions?.mastersOut) {
      validCheckoutMultipliers = [2, 3];
    }

    const results: Dart[][] = [];

    this.dfs(
      allDartsCombinations,
      score,
      [],
      results,
      validCheckoutMultipliers,
      checkoutOptions
    );

    results.sort((a, b) => a.length - b.length);
    return results;
  }

  private static dfs(
    darts: Dart[],
    target: number,
    path: Dart[],
    results: Dart[][],
    validCheckoutMultipliers: number[],
    { doubleOut = false, mastersOut = false }: CheckoutOptions = {}
  ) {
    if (
      target === 0 &&
      path.length > 0 &&
      validCheckoutMultipliers.includes(path[path.length - 1].multiplier)
    ) {
      results.push([...path]);
      return;
    }

    if (target < 0 || path.length === 3) {
      return;
    }

    for (let dart of darts) {
      path.push(dart);
      this.dfs(
        darts,
        target - dart.value * dart.multiplier,
        path,
        results,
        validCheckoutMultipliers,
        {
          doubleOut,
          mastersOut
        }
      );
      path.pop();
    }
  }
}
