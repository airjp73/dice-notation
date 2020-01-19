// Nodes
export interface Node {
  type: string;
  token: Token;
}

export interface DiceRollNode {
  type: 'DiceRoll';
  count: number;
  numSides: number;
}

export interface ConstantNode {
  type: 'Constant';
  value: number;
}

export type Operator = '+' | '-' | '/' | '*';

export interface OperatorNode {
  type: 'Operator';
  operator: Operator;
  left: DiceNotationTree;
  right: DiceNotationTree;
}

export type DiceNotationTree = OperatorNode | DiceRollNode | ConstantNode;
