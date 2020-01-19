import { Token, TokenType } from './tokens';
import ParsingError from './ParsingError';

function tokenize(notation: string): Token[] {
  const tokens: Token[] = [];

  let currentDiceToken = '';

  function handleCurrentDiceToken(index: number) {
    validateTokenIsDiceToken(currentDiceToken, notation, index);
    const numbers = currentDiceToken.split('d').map(num => parseInt(num));
    tokens.push({
      type: TokenType.DiceRoll,
      position: index - currentDiceToken.length,
      content: currentDiceToken,
      count: numbers[0],
      numSides: numbers[1],
    });
    currentDiceToken = '';
  }

  const validOperators = ['+', '-', '*', '/', '(', ')'];
  function handleOperator(operator: string, index: number) {
    if (
      operator === '+' ||
      operator === '-' ||
      operator === '*' ||
      operator === '/'
    ) {
      tokens.push({
        type: TokenType.Operator,
        position: index,
        content: operator,
        operator: operator,
      });
    } else if (operator === '(') {
      tokens.push({
        type: TokenType.OpenParen,
        position: index,
        content: operator,
      });
    } else if (operator === ')') {
      tokens.push({
        type: TokenType.CloseParen,
        position: index,
        content: operator,
      });
    }
  }

  for (let i = 0; i < notation.length; i++) {
    const char = notation.charAt(i);

    if (char.match(/\d/)) {
      currentDiceToken += char;
    } else if (char === 'd') {
      validateTokenIsOnlyNumbers(currentDiceToken, notation, i);
      currentDiceToken += char;
    } else if (char === ' ') {
      if (currentDiceToken) handleCurrentDiceToken(i);
    } else if (validOperators.includes(char)) {
      if (currentDiceToken) handleCurrentDiceToken(i);
      handleOperator(char, i);
    } else {
      throw new ParsingError(`Unexpected token`, notation, char, i);
    }
  }

  if (currentDiceToken) handleCurrentDiceToken(notation.length);

  if (tokens.length === 0) {
    throw new Error('Unable to parse');
  }

  return tokens;
}

function validateTokenIsOnlyNumbers(
  token: string,
  notation: string,
  index: number
) {
  if (token.match(/\D/)) {
    throw new ParsingError('Unexpected token', notation, token, index);
  }
}

function validateTokenIsDiceToken(
  token: string,
  notation: string,
  index: number
) {
  if (!token.match(/\d+d\d+/)) {
    throw new ParsingError(
      'Unable to interpret dice roll token',
      notation,
      token,
      index
    );
  }
}

export default tokenize;
