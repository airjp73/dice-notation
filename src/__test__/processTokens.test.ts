import tokenize from '../tokenize';
import processTokens from '../processTokens';

describe('processTokens', () => {
  const cases: [string, number, number, number][] = [
    ['1d6', 1, 6, 12],
    ['1d12', 1, 12, 12],
    ['1d6 + 5', 6, 11, 12],
    ['4d6', 4, 36, 36],
    ['1d12 * 2d4', 2, 96, 200],
  ];

  it.each(cases)('should correctly roll %s', (notation, min, max, repeats) => {
    for (let i = 0; i < repeats; i++) {
      const result = processTokens(tokenize(notation)).value;
      expect(result).toBeLessThanOrEqual(max);
      expect(result).toBeGreaterThanOrEqual(min);
    }
  });
});
