import { DiceNotationTree, DiceRollNode } from '../types';
import { diceRoll, operator, constant } from '../objectConstructors';
import lex from '../lexer';

describe('lexer', () => {
  const cases: [string, string, DiceNotationTree][] = [
    ['single dice roll', '1d6', diceRoll(1, 6)],
    [
      'adding a constant',
      '3d6 + 10',
      operator('+', diceRoll(3, 6), constant(10)),
    ],
    [
      'adding two dice',
      '3d6 + 10d4',
      operator('+', diceRoll(3, 6), diceRoll(10, 4)),
    ],
    [
      'weird dice',
      '3d7 + 2d11',
      operator('+', diceRoll(3, 7), diceRoll(2, 11)),
    ],
    ['subtraction', '1d6 - 1d4', operator('-', diceRoll(1, 6), diceRoll(1, 4))],
    [
      'multiplication',
      '1d6 * 1d4',
      operator('*', diceRoll(1, 6), diceRoll(1, 4)),
    ],
    ['division', '1d6 / 1d4', operator('/', diceRoll(1, 6), diceRoll(1, 4))],
    [
      'parenthesis',
      '(1d6 + 1d4) * 3d8',
      operator(
        '*',
        operator('+', diceRoll(1, 6), diceRoll(1, 4)),
        diceRoll(3, 8)
      ),
    ],
    [
      'PEMDAS',
      '1d6 + 2d4 * 3d8 / 4d9 - 3d7',
      operator(
        '-',
        operator(
          '+',
          diceRoll(1, 6),
          operator(
            '/',
            operator('*', diceRoll(2, 4), diceRoll(3, 8)),
            diceRoll(4, 9)
          )
        ),
        diceRoll(3, 7)
      ),
    ],
  ];

  it.each(cases)('should correctly lex %s', (description, notation, result) => {
    expect(lex(notation)).toStrictEqual(result);
  });
});
