import {
  DiceRollNode,
  DiceNotationNode,
  Operator,
  OperatorNode,
  ConstantNode,
} from './nodes';

export const diceRoll = (count: number, numSides: number): DiceRollNode => ({
  type: 'DiceRoll',
  count,
  numSides,
});

export const operator = (
  operator: Operator,
  left: DiceNotationNode,
  right: DiceNotationNode
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
