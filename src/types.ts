export interface DiceRollNode {
  count: number;
  numSides: number;
}

type Operator = '+' | '-' | '/' | '*';

export interface OperatorNode {
  operator: Operator;
  left: DiceRollNode;
  right: DiceRollNode;
}

export type DiceNotationTree = OperatorNode | DiceRollNode;
