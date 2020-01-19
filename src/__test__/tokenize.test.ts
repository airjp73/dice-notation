import lex from '../lexer';
import {
  Token,
  diceRollToken,
  operatorToken,
  constantToken,
  openParenToken,
  closeParenToken,
} from '../tokens';

describe('tokenizer', () => {
  const cases: [string, string, Token[]][] = [
    ['single dice roll', '1d6', [diceRollToken(1, 6, 0, '1d6')]],
    [
      'adding a constant',
      '3d6 + 10',
      [
        diceRollToken(3, 6, 0, '3d6'),
        operatorToken('+', 4, '+'),
        constantToken(10, 6, '10'),
      ],
    ],
    [
      'adding two dice',
      '3d6 + 10d4',
      [
        diceRollToken(3, 6, 0, '3d6'),
        operatorToken('+', 4, '+'),
        diceRollToken(10, 4, 6, '10d4'),
      ],
    ],
    [
      'weird dice',
      '3d7 + 2d11',
      [
        diceRollToken(3, 7, 0, '3d7'),
        operatorToken('+', 4, '+'),
        diceRollToken(10, 4, 6, '2d11'),
      ],
    ],
    [
      'subtraction',
      '1d6 - 1d4',
      [
        diceRollToken(1, 6, 0, '1d6'),
        operatorToken('-', 4, '-'),
        diceRollToken(1, 4, 6, '1d4'),
      ],
    ],
    [
      'multiplication',
      '1d6 * 1d4',
      [
        diceRollToken(1, 6, 0, '1d6'),
        operatorToken('*', 4, '*'),
        diceRollToken(1, 4, 6, '1d4'),
      ],
    ],
    [
      'division',
      '1d6 / 1d4',
      [
        diceRollToken(1, 6, 0, '1d6'),
        operatorToken('/', 4, '/'),
        diceRollToken(1, 4, 6, '1d4'),
      ],
    ],
    [
      'parenthesis',
      '(1d6 + 1d4) * 3d8',
      [
        openParenToken(0, '('),
        diceRollToken(1, 6, 1, '1d6'),
        operatorToken('+', 5, '+'),
        diceRollToken(1, 4, 7, '1d4'),
        closeParenToken(10, ')'),
        operatorToken('*', 12, '*'),
        diceRollToken(3, 8, 14, '3d8'),
      ],
    ],
    [
      'PEMDAS',
      '1d6 + 2d4 * 3d8 / 4d9 - 3d7',
      [
        diceRollToken(1, 6, 0, '1d6'),
        operatorToken('+', 4, '+'),
        diceRollToken(2, 4, 6, '2d4'),
        operatorToken('*', 10, '*'),
        diceRollToken(3, 8, 12, '3d8'),
        operatorToken('/', 16, '/'),
        diceRollToken(4, 9, 18, '4d9'),
        operatorToken('-', 22, '-'),
        diceRollToken(3, 7, 24, '3d7'),
      ],
    ],
    [
      'Extra spaces',
      '1d6     +   2d4       * 3d8 / 4d9    - 3d7',
      [
        diceRollToken(1, 6, 0, '1d6'),
        operatorToken('+', 8, '+'),
        diceRollToken(2, 4, 12, '2d4'),
        operatorToken('*', 22, '*'),
        diceRollToken(3, 8, 24, '3d8'),
        operatorToken('/', 30, '/'),
        diceRollToken(4, 9, 32, '4d9'),
        operatorToken('-', 39, '-'),
        diceRollToken(3, 7, 41, '3d7'),
      ],
    ],
    [
      'No spaces',
      '1d6+2d4*3d8/4d9-3d7',
      [
        diceRollToken(1, 6, 0, '1d6'),
        operatorToken('+', 3, '+'),
        diceRollToken(2, 4, 4, '2d4'),
        operatorToken('*', 7, '*'),
        diceRollToken(3, 8, 8, '3d8'),
        operatorToken('/', 11, '/'),
        diceRollToken(4, 9, 12, '4d9'),
        operatorToken('-', 15, '-'),
        diceRollToken(3, 7, 16, '3d7'),
      ],
    ],
  ];

  it.each(cases)('should correctly lex %s', (description, notation, result) => {
    expect(lex(notation)).toStrictEqual(result);
  });
});
