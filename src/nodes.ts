import { Token } from './tokens';

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
