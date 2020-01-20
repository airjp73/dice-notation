import {
  Token,
  DiceRollResult,
  TokenType,
  ResultToken,
  DiceRollToken,
  RolledDiceToken,
} from './tokens';
import ExhaustiveCaseError from './ExhaustiveCaseError';
import { getPrecedence, Operator } from './operators';

const rollDiceToken = (token: DiceRollToken): RolledDiceToken => {
  const rolls: number[] = [];
  for (let i = 0; i < token.count; i++) {
    rolls.push(Math.floor(Math.random() * Math.floor(token.numSides - 1)) + 1);
  }
  return { ...token, rolls };
};

function doMath(val1: number, operator: Operator, val2: number): number {
  switch (operator) {
    case '*':
      return val1 * val2;
    case '+':
      return val1 + val2;
    case '-':
      return val1 - val2;
    case '/':
      return val1 / val2;
  }
}

/**
 * Takes a list of Tokens from the tokenize function and processes them.
 * @param tokens the list of tokens generated by the tokenize function
 */
function processTokens(tokens: Token[]): DiceRollResult {
  const processingTokens: ResultToken[] = tokens.map(token => {
    if (token.type === TokenType.DiceRoll) {
      return rollDiceToken(token);
    } else {
      return { ...token };
    }
  });
  let i = 0;

  function tallyRolls(): number {
    let stack: ResultToken[] = [];
    let total: number = 0;

    const peekTop = () => stack[stack.length - 1];

    const popValue = (): number => {
      const top = stack.pop();
      if (!top)
        throw new Error('Expected constant or dice roll but got nothing');

      if (top.type === TokenType.Constant) {
        return top.value;
      } else if (top.type === TokenType.DiceRoll) {
        return top.rolls.reduce((agg, num) => agg + num, 0);
      } else {
        throw new Error(`Unexpected token: ${top.content}`);
      }
    };

    const popOperator = (): Operator => {
      const top = stack.pop();
      if (!top) throw new Error('Expected operator but got nothing');

      if (top.type !== TokenType.Operator)
        throw new Error(`Unexpected token: ${top.content}`);

      return top.operator;
    };

    const popStack = () => {
      total += popValue();

      while (stack.length) {
        const operator = popOperator();
        const value = popValue();
        total = doMath(value, operator, total);
      }
    };

    for (; i < tokens.length; i++) {
      let token = processingTokens[i];

      switch (token.type) {
        case TokenType.DiceRoll:
        case TokenType.Constant:
          const top = peekTop();
          stack.push(token);
          const lookAhead = tokens[i + 1];
          if (
            top &&
            top.type === TokenType.Operator &&
            (!lookAhead ||
              lookAhead.type !== TokenType.Operator ||
              getPrecedence(top.operator) <= getPrecedence(lookAhead.operator))
          ) {
            popStack();
          }
          break;
        case TokenType.CloseParen:
          if (stack.length)
            throw new Error(`Unexpected token: ${peekTop().content}`);
          return total;
        case TokenType.OpenParen:
          i++;
          stack.push({
            type: TokenType.Constant,
            value: tallyRolls(),
            content: 'asdf',
            position: 9,
          });
          break;
        case TokenType.Operator:
          stack.push(token);
          break;
        default:
          throw new ExhaustiveCaseError('Unknown token type', token);
      }
    }

    if (stack.length) popStack();
    return total;
  }

  return {
    value: tallyRolls(),
    tokens: processingTokens,
  };
}

export default processTokens;
