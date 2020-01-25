import roll from '../roll';

describe('processTokens', () => {
  const cases: [string, number, number, number][] = [
    ['1d6', 1, 6, 12],
    ['1d12', 1, 12, 12],
    ['1d6 + 5', 6, 11, 12],
    ['4d6', 4, 36, 36],
    ['1d12 * 2d4 / 2', 1, 48, 200],
    ['1d4 + 1d4 + 1d4 + 1d4', 4, 16, 24],
    ['1d4 * (1d4 + 2)', 3, 24, 30],

    // Constants to truly verify operator precedence
    ['2 + 3 * (4 + 2)', 20, 20, 1],
    ['4*4 + 4 / 2 -10', 8, 8, 1],
    ['(2 + 2) * (3 * (3 - 1)) - (3 + 1)', 20, 20, 1],

    // TODO: Support negatives?
    ['64 * (0-3) - 4008 / 5 + (0-328)', -1321.6, -1321.6, 1],
  ];

  it.each(cases)('should correctly roll %s', (notation, min, max, repeats) => {
    for (let i = 0; i < repeats; i++) {
      const { result } = roll(notation);
      expect(result).toBeLessThanOrEqual(max);
      expect(result).toBeGreaterThanOrEqual(min);
    }
  });
});
