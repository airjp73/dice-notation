import { Token, diceRollToken, operatorToken, constantToken } from './tokens';

// Nodes
export interface Node {
  type: string;
  token: Token;
}

export interface DiceRollNode extends Node {
  type: 'DiceRoll';
  count: number;
  numSides: number;
}

export interface ConstantNode extends Node {
  type: 'Constant';
  value: number;
}

export type Operator = '+' | '-' | '/' | '*';

export interface OperatorNode extends Node {
  type: 'Operator';
  operator: Operator;
  left: DiceNotationNode;
  right: DiceNotationNode;
}

export type DiceNotationNode = OperatorNode | DiceRollNode | ConstantNode;

// Node builders used for constructing test data
export const diceRollNode = (
  count: number,
  numSides: number
): DiceRollNode => ({
  type: 'DiceRoll',
  count,
  numSides,
  token: diceRollToken(count, numSides, 0, `${count}d${numSides}`),
});

export const operatorNode = (
  operator: Operator,
  left: DiceNotationNode,
  right: DiceNotationNode
): OperatorNode => ({
  type: 'Operator',
  operator,
  left,
  right,
  token: operatorToken(operator, 0, operator),
});

export const constantNode = (value: number): ConstantNode => ({
  type: 'Constant',
  value,
  token: constantToken(value, 0, '' + value),
});
