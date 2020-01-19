import {
  DiceRollNode,
  DiceNotationTree,
  Operator,
  OperatorNode,
  ConstantNode,
} from './types';

export const diceRoll = (count: number, numSides: number): DiceRollNode => ({
  type: 'DiceRoll',
  count,
  numSides,
});

export const operator = (
  operator: Operator,
  left: DiceNotationTree,
  right: DiceNotationTree
): OperatorNode => ({
  type: 'Operator',
  operator,
  left,
  right,
});

export const constant = (value: number): ConstantNode => ({
  type: 'Constant',
  value,
});
