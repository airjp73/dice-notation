import {
  DiceNotationNode,
  DiceRollNode,
  diceRollNode,
  operatorNode,
  constantNode,
} from '../nodes';
import lex from '../lexer';
import tokenize from '../tokenize';

describe('lexer', () => {
  const cases: [string, string, DiceNotationNode][] = [
    ['single dice roll', '1d6', diceRollNode(1, 6)],
    [
      'adding a constant',
      '3d6 + 10',
      operatorNode('+', diceRollNode(3, 6), constantNode(10)),
    ],
    [
      'adding two dice',
      '3d6 + 10d4',
      operatorNode('+', diceRollNode(3, 6), diceRollNode(10, 4)),
    ],
    [
      'weird dice',
      '3d7 + 2d11',
      operatorNode('+', diceRollNode(3, 7), diceRollNode(2, 11)),
    ],
    [
      'subtraction',
      '1d6 - 1d4',
      operatorNode('-', diceRollNode(1, 6), diceRollNode(1, 4)),
    ],
    [
      'multiplication',
      '1d6 * 1d4',
      operatorNode('*', diceRollNode(1, 6), diceRollNode(1, 4)),
    ],
    [
      'division',
      '1d6 / 1d4',
      operatorNode('/', diceRollNode(1, 6), diceRollNode(1, 4)),
    ],
    [
      'parenthesis',
      '(1d6 + 1d4) * 3d8',
      operatorNode(
        '*',
        operatorNode('+', diceRollNode(1, 6), diceRollNode(1, 4)),
        diceRollNode(3, 8)
      ),
    ],
    [
      'PEMDAS',
      '1d6 + 2d4 * 3d8 / 4d9 - 3d7',
      operatorNode(
        '-',
        operatorNode(
          '+',
          diceRollNode(1, 6),
          operatorNode(
            '/',
            operatorNode('*', diceRollNode(2, 4), diceRollNode(3, 8)),
            diceRollNode(4, 9)
          )
        ),
        diceRollNode(3, 7)
      ),
    ],
  ];

  it.each(cases)('should correctly lex %s', (description, notation, result) => {
    const tokens = tokenize(notation);
    expect(lex(tokens)).toStrictEqual(result);
  });
});
