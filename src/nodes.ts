import { Token, diceRollToken, operatorToken, constantToken } from './tokens';
import { Operator } from './operators';

export enum NodeType {
  DiceRoll = 'DiceRoll',
  Operator = 'Operator',
  Constant = 'Constant',
}

// Nodes
export interface Node {
  type: string;
  token: Token;
}

export interface DiceRollNode extends Node {
  type: NodeType.DiceRoll;
  count: number;
  numSides: number;
}

export interface ConstantNode extends Node {
  type: NodeType.Constant;
  value: number;
}

export interface OperatorNode extends Node {
  type: NodeType.Operator;
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
  type: NodeType.DiceRoll,
  count,
  numSides,
  token: diceRollToken(count, numSides, 0, `${count}d${numSides}`),
});

export const operatorNode = (
  operator: Operator,
  left: DiceNotationNode,
  right: DiceNotationNode
): OperatorNode => ({
  type: NodeType.Operator,
  operator,
  left,
  right,
  token: operatorToken(operator, 0, operator),
});

export const constantNode = (value: number): ConstantNode => ({
  type: NodeType.Constant,
  value,
  token: constantToken(value, 0, '' + value),
});
