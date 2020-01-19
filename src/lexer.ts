import { DiceNotationTree } from './types';
import { diceRoll } from './objectConstructors';

export default function lex(notation: string): DiceNotationTree {
  let currentNode: DiceNotationTree | null = null;
  let currentDiceToken = '';

  function handleCurrentDiceToken(index: number) {
    validateTokenIsDiceToken(currentDiceToken, notation, index);
    const numbers = currentDiceToken.split('d').map(num => parseInt(num));
    currentNode = diceRoll(numbers[0], numbers[1]);
    currentDiceToken = '';
  }

  for (let i = 0; i < notation.length; i++) {
    const char = notation.charAt(i);

    if (char.match(/\d/)) {
      currentDiceToken += char;
    } else if (char === ' ' && !!currentDiceToken) {
      handleCurrentDiceToken(i);
    } else if (char === 'd') {
      validateTokenIsOnlyNumbers(currentDiceToken, notation, i);
      currentDiceToken += char;
    } else if (['+', '-', '*', '/'].includes(char)) {
      // do operator thing
    } else if (char === '(') {
    } else if (char === ')') {
    }
  }

  if (currentDiceToken) handleCurrentDiceToken(notation.length);

  if (!currentNode) {
    throw new Error('Unable to parse');
  }

  return currentNode;
}

function validateTokenIsOnlyNumbers(
  token: string,
  notation: string,
  index: number
) {
  if (token.match(/\D/)) {
    throw new Error(
      `Unexpected token 'd' at position ${index}.\n` +
        `${notation}\n` +
        ' '.repeat(index - 1) +
        '^'
    );
  }
}

function validateTokenIsDiceToken(
  token: string,
  notation: string,
  index: number
) {
  if (!token.match(/\d+d\d+/)) {
    throw new Error(
      `Unable to interpret token: ${token}` +
        `${notation}\n` +
        ' '.repeat(index - 1 - token.length) +
        '^'
    );
  }
}
