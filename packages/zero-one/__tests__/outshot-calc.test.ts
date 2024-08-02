import { OutshotCalculator } from '../outshot-calc';

describe('outshot caluclator tests', () => {
  it('should calculate outshot combinations for given number, when double out', () => {
    for (const num of [40, 50, 60, 70, 80, 90, 100]) {
      const combinations = OutshotCalculator.findOuthsotCombinations(num, {
        doubleOut: true
      });

      for (let combination of combinations) {
        const sum = combination.reduce(
          (acc, dart) => acc + dart.value * dart.multiplier,
          0
        );

        expect(sum).toBe(num);
        expect(combination.at(-1)?.multiplier).toBe(2);
      }
    }
  });
});
