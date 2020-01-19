import { DiceNotationNode } from './nodes';
import {
  Token,
  ConstantToken,
  DiceRollToken,
  OperatorToken,
  TokenType,
  OpenParenToken,
  CloseParenToken,
} from './tokens';
import LexingError from './LexingError';
import { getPrecedence } from './operators';

function lex(tokens: Token[]): DiceNotationNode | null {
  let head: DiceNotationNode | null = null;
  const stack: Token[] = [];
  const peekStack = (): Token | null =>
    stack.length ? stack[stack.length - 1] : null;

  function popStack() {
    // Pop down the stack to build up the tree
  }

  function handleLeaf(token: ConstantToken | DiceRollToken, index: number) {
    const top = peekStack();

    if (top === null) {
      stack.push(token);
      return;
    }

    if (top.type !== TokenType.Operator) {
      throw new LexingError('Unexpected Token', token);
    }

    const nextToken = tokens[index + 1];
    if (nextToken?.type === TokenType.Operator) {
      stack.push(token);
      if (getPrecedence(nextToken.operator) > getPrecedence(top.operator)) {
        popStack();
      }
    }
  }

  function handleConstant(token: ConstantToken, index: number) {}

  function handleDiceRoll(token: DiceRollToken, index: number) {}

  function handleOperator(token: OperatorToken, index: number) {}

  function handleOpenParen(token: OpenParenToken, index: number) {}

  function handleCloseParen(token: CloseParenToken, index: number) {}

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    switch (token.type) {
      case TokenType.Constant:
        handleLeaf(token, i);
        break;
      case TokenType.DiceRoll:
        handleLeaf(token, i);
        break;
      case TokenType.Operator:
      case TokenType.OpenParen:
        // handleOperator(token, i);
        // handleOpenParen(token, i);
        // handleCloseParen(token, i);
        stack.push(token);
        break;
      case TokenType.CloseParen:
        popStack();
        break;
    }
  }

  return head;
}

export default lex;
