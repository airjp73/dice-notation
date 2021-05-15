import calculateFinalResult from '../calculateFinalResult';
import createDiceRoller from '../createDiceRoller';
import { rollDice, roll, tokenize, tallyRolls } from '../index';
import { diceRollToken } from '../tokens';

const customRoller = createDiceRoller();

const manualRoll: typeof roll = (notation, config) => {
  const tokens = tokenize(notation, config);
  const rolls = rollDice(tokens, config);
  const tallies = tallyRolls(tokens, rolls, config);
  return calculateFinalResult(tokens, tallies);
};

describe('roll', () => {
  const cases: [string, number, number][] = [
    ['1d6', 1, 6],
    ['1d12', 1, 12],
    ['1d6 + 5', 6, 11],
    ['4d6', 4, 36],
    ['1d12 * 2d4 / 2', 1, 48],
    ['1d4 + 1d4 + 1d4 + 1d4', 4, 16],
    ['1d4 * (1d4 + 2)', 3, 24],
    ['1d2', 1, 2],
    ['100000d6', 100000, 600000],

    // Constants to truly verify operator precedence
    ['2 + 3 * (4 + 2)', 20, 20],
    ['2*2', 4, 4],
    ['4*4 + 4 / 2 -10', 8, 8],
    ['(2 + 2) * (3 * (3 - 1)) - (3 + 1)', 20, 20],
    ['64 * (0-3) - 4008 / 5 + (0-328)', -1321.6, -1321.6],
    ['2', 2, 2],

    // Support for unary operators
    ['2 + -2', 0, 0],
    ['-2 + 2', 0, 0],
    ['+2 + 2', 4, 4],
    ['-2 + -2', -4, -4],
    ['2 * -2', -4, -4],
    ['-2 * -2', 4, 4],
    ['+2 / -2', -1, -1],
    ['------2', 2, 2],
    ['2 + ------2', 4, 4],
    ['++++++2 + ------2', 4, 4],
    ['-1d6 + -2d4', -14, -3],
    ['+1d6 + +2d4', 3, 14],
    ['+1d6 - +2d4', -7, 4],
    ['-(1d6 + -6) - +(4 + 5)', -9, -4],
  ];

  const minConfig = { random: (min: number) => min };
  const maxConfig = { random: (min: number, max: number) => max };

  it.each(cases)('should correctly roll %s', (notation, min, max) => {
    expect(roll(notation, maxConfig).result).toBeLessThanOrEqual(max);
    expect(roll(notation, minConfig).result).toBeGreaterThanOrEqual(min);
    expect(manualRoll(notation, maxConfig)).toBeLessThanOrEqual(max);
    expect(manualRoll(notation, minConfig)).toBeGreaterThanOrEqual(min);

    expect(customRoller.roll(notation, maxConfig).result).toBeLessThanOrEqual(
      max
    );
    expect(
      customRoller.roll(notation, minConfig).result
    ).toBeGreaterThanOrEqual(min);
  });

  const errorCases: [string, string][] = [
    ['2 + *3', "Operator '*' may not be used as a unary operator"],
    ['2 + /3', "Operator '/' may not be used as a unary operator"],
    ['100001d100', 'Cannot roll more than 100000 dice'],
  ];

  it.each(errorCases)('should correctly error on %s', (notation, error) => {
    expect(() => roll(notation)).toThrowError(error);
    expect(() => customRoller.roll(notation)).toThrowError(error);
    expect(() => manualRoll(notation)).toThrowError(error);
  });
});

describe('rollDice', () => {
  it('should handle rolls', () => {
    const tokens = [
      diceRollToken(1, 6, 0, ''),
      diceRollToken(5, 8, 0, ''),
      diceRollToken(2, 10, 0, ''),
      diceRollToken(4, 4, 0, ''),
    ];

    const result = rollDice(tokens);
    expect(result).toHaveLength(tokens.length);
    result.forEach((rolls, index) => {
      const { count } = tokens[index].detail;
      expect(rolls).toHaveLength(count);
    });
  });
});
