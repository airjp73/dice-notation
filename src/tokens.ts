import { Operator } from './nodes';

export enum TokenType {
  OpenParen = 'OpenParen',
  CloseParen = 'CloseParen',
  Operator = 'Operator',
  DiceRoll = 'DiceRoll',
  Constant = 'Constant',
}

export interface BaseToken {
  type: TokenType;
  position: number;
  content: string;
}

export interface OpenParenToken extends BaseToken {
  type: TokenType.OpenParen;
}

export interface CloseParenToken extends BaseToken {
  type: TokenType.CloseParen;
}

export interface OperatorToken extends BaseToken {
  type: TokenType.Operator;
  operator: Operator;
}

export interface DiceRollToken extends BaseToken {
  type: TokenType.DiceRoll;
  count: number;
  numSides: number;
}

export interface ConstantToken extends BaseToken {
  type: TokenType.Constant;
  value: number;
}

export type Token =
  | OpenParenToken
  | CloseParenToken
  | OperatorToken
  | DiceRollToken
  | ConstantToken;

// Token builders used for constructing test data
export const openParenToken = (
  position: number,
  content: string
): OpenParenToken => ({
  type: TokenType.OpenParen,
  position,
  content,
});

export const closeParenToken = (
  position: number,
  content: string
): CloseParenToken => ({
  type: TokenType.CloseParen,
  position,
  content,
});

export const operatorToken = (
  operator: Operator,
  position: number,
  content: string
): OperatorToken => ({
  type: TokenType.Operator,
  position,
  content,
  operator,
});

export const diceRollToken = (
  count: number,
  numSides: number,
  position: number,
  content: string
): DiceRollToken => ({
  type: TokenType.DiceRoll,
  position,
  content,
  count,
  numSides,
});

export const constantToken = (
  value: number,
  position: number,
  content: string
): ConstantToken => ({
  type: TokenType.Constant,
  position,
  content,
  value,
});
