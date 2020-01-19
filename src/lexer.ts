import { DiceNotationNode, NodeType } from './nodes';
import {
  Token,
  ConstantToken,
  DiceRollToken,
  OperatorToken,
  TokenType,
  OpenParenToken,
  CloseParenToken,
} from './tokens';

function lex(tokens: Token[]): DiceNotationNode | null {
  let head: DiceNotationNode | null = null;

  function handleConstant(token: ConstantToken) {}

  function handleDiceRoll(token: DiceRollToken) {}

  function handleOperator(token: OperatorToken) {}

  function handleOpenParen(token: OpenParenToken) {}

  function handleCloseParen(token: CloseParenToken) {}

  tokens.forEach(token => {
    switch (token.type) {
      case TokenType.Constant:
        handleConstant(token);
        break;
      case TokenType.DiceRoll:
        handleDiceRoll(token);
        break;
      case TokenType.Operator:
        handleOperator(token);
        break;
      case TokenType.OpenParen:
        handleOpenParen(token);
        break;
      case TokenType.CloseParen:
        handleCloseParen(token);
        break;
    }
  });

  return head;
}

export default lex;
