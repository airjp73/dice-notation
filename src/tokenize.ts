import * as moo from 'moo';
import { TokenType, Token } from './tokens';
import { Operator } from './operators';

function tokenize(notation: string): Token[] {
  const WHITE_SPACE = 'WHITE_SPACE';

  const lexer = moo.compile({
    [WHITE_SPACE]: /[ \t]+/,
    [TokenType.DiceRoll]: /\d+d\d+/,
    [TokenType.Constant]: /\d+/,
    [TokenType.Operator]: /\*|\/|\+|-/,
    [TokenType.OpenParen]: '(',
    [TokenType.CloseParen]: ')',
  });

  lexer.reset(notation);

  return Array.from(lexer)
    .filter(token => token.type !== WHITE_SPACE)
    .map(processToken);
}

/**
 * Take a moo token and turn it into a dice-notation token.
 * @param token the moo token
 */
function processToken(token: moo.Token): Token {
  switch (token.type) {
    case TokenType.DiceRoll:
      const numbers = token.value.split('d').map(num => parseInt(num));
      return {
        type: TokenType.DiceRoll,
        position: token.col - 1,
        content: token.value,
        count: numbers[0],
        numSides: numbers[1],
      };
    case TokenType.Constant:
      return {
        type: TokenType.Constant,
        position: token.col - 1,
        content: token.value,
        value: parseInt(token.value),
      };
    case TokenType.Operator:
      return {
        type: TokenType.Operator,
        position: token.col - 1,
        content: token.value,
        operator: token.value as Operator,
      };
    case TokenType.OpenParen:
      return {
        type: TokenType.OpenParen,
        position: token.col - 1,
        content: token.value,
      };
    case TokenType.CloseParen:
      return {
        type: TokenType.CloseParen,
        position: token.col - 1,
        content: token.value,
      };
    default:
      throw new Error('Unrecognized token');
  }
}

export default tokenize;
