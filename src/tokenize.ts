import { Token, TokenType } from './tokens';
import ParsingError from './ParsingError';

function tokenize(notation: string): Token[] {
  const tokens: Token[] = [];

  let currentToken = '';

  function handletDiceOrConstant(index: number) {
    if (isDiceToken(currentToken)) {
      const numbers = currentToken.split('d').map(num => parseInt(num));
      tokens.push({
        type: TokenType.DiceRoll,
        position: index - currentToken.length,
        content: currentToken,
        count: numbers[0],
        numSides: numbers[1],
      });
    } else if (isConstantToken(currentToken)) {
      tokens.push({
        type: TokenType.Constant,
        position: index - currentToken.length,
        content: currentToken,
        value: parseInt(currentToken),
      });
    } else {
      throw new ParsingError(
        'Unable to interpret dice roll token',
        notation,
        currentToken,
        index
      );
    }
    currentToken = '';
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
      currentToken += char;
    } else if (char === 'd') {
      validateTokenIsOnlyNumbers(currentToken, notation, i);
      currentToken += char;
    } else if (char === ' ') {
      if (currentToken) handletDiceOrConstant(i);
    } else if (validOperators.includes(char)) {
      if (currentToken) handletDiceOrConstant(i);
      handleOperator(char, i);
    } else {
      throw new ParsingError(`Unexpected token`, notation, char, i);
    }
  }

  if (currentToken) handletDiceOrConstant(notation.length);

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

function isDiceToken(token: string): boolean {
  return !!token.match(/\d+d\d+/);
}

function isConstantToken(token: string): boolean {
  return !token.match(/\D/);
}

export default tokenize;
