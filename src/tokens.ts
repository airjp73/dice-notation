import { Operator } from './operators';
import { SimpleDiceRollToken } from './rules/simpleDieRoll';

export enum CoreTokenTypes {
  OpenParen = '_OpenParen',
  CloseParen = '_CloseParen',
  Operator = '_Operator',
  DiceRoll = '_DiceRoll',
  Constant = '_Constant',
}

export interface BaseToken {
  type: string;
  position: number;
  content: string;
}

export interface OpenParenToken extends BaseToken {
  type: CoreTokenTypes.OpenParen;
}

export interface CloseParenToken extends BaseToken {
  type: CoreTokenTypes.CloseParen;
}

export interface OperatorToken extends BaseToken {
  type: CoreTokenTypes.Operator;
  operator: Operator;
}

export interface DiceRollToken<T = any> extends BaseToken {
  detail: any;
}

export type Token =
  | OpenParenToken
  | CloseParenToken
  | OperatorToken
  | DiceRollToken;

// Token builders used for constructing test data
export const openParenToken = (
  position: number,
  content: string
): OpenParenToken => ({
  type: CoreTokenTypes.OpenParen,
  position,
  content,
});

export const closeParenToken = (
  position: number,
  content: string
): CloseParenToken => ({
  type: CoreTokenTypes.CloseParen,
  position,
  content,
});

export const operatorToken = (
  operator: Operator,
  position: number,
  content: string
): OperatorToken => ({
  type: CoreTokenTypes.Operator,
  position,
  content,
  operator,
});

export const diceRollToken = (
  count: number,
  numSides: number,
  position: number,
  content: string
): DiceRollToken<SimpleDiceRollToken> => ({
  type: CoreTokenTypes.DiceRoll,
  position,
  content,
  detail: { count, numSides },
});

export const constantToken = (
  value: number,
  position: number,
  content: string
): DiceRollToken<number> => ({
  type: CoreTokenTypes.Constant,
  position,
  content,
  detail: value,
});
