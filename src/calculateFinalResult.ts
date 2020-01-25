import ExhaustiveCaseError from './ExhaustiveCaseError';
import { getPrecedence, Operator } from './operators';
import { CoreTokenTypes, Token } from './tokens';
import { RollTotal } from './tallyRolls';
import isNil from './util/isNill';

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

const isOperator = (stackItem: ValueOrOperatorString): stackItem is Operator =>
  typeof stackItem === 'string';
const isValue = (stackItem: ValueOrOperatorString): stackItem is number =>
  typeof stackItem === 'number';

type ValueOrOperatorString = number | Operator;

function calculateFinalResult(tokens: Token[], values: RollTotal[]): number {
  let i = 0;

  function tallyRolls() {
    let stack: ValueOrOperatorString[] = [];

    const peekTop = () => stack[stack.length - 1];

    const popValue = (): number => {
      const top = stack.pop();
      if (isNil(top))
        throw new Error('Expected dice roll or constant but got nothing');
      if (isOperator(top))
        throw new Error('Expected dice roll or constant but got operator');
      return top;
    };

    const popOperator = (): Operator => {
      const top = stack.pop();
      if (isNil(top)) throw new Error('Expected operator but got nothing');
      if (isValue(top))
        throw new Error('Expected operator but got dice roll or constant');
      return top;
    };

    const popStack = () => {
      let total = popValue();

      while (stack.length) {
        const operator = popOperator();
        const value = popValue();
        total = doMath(value, operator, total);
      }

      stack.push(total);
    };

    const popStackIfNecessary = (top: ValueOrOperatorString) => {
      const lookAhead = tokens[i + 1];
      if (
        top &&
        isOperator(top) &&
        (isNil(lookAhead) ||
          lookAhead.type !== CoreTokenTypes.Operator ||
          getPrecedence(top) <= getPrecedence(lookAhead.operator))
      ) {
        popStack();
      }
    };

    const getRollValue = (): number => {
      const value = values[i];
      if (isNil(value))
        throw new Error(
          `Roll values do not match provided tokens. Expected value but got none at position ${i}`
        );
      return value;
    };

    for (; i < tokens.length; i++) {
      let token = tokens[i];

      switch (token.type) {
        case CoreTokenTypes.DiceRoll: {
          const top = peekTop();
          stack.push(getRollValue());
          popStackIfNecessary(top);
          break;
        }
        case CoreTokenTypes.OpenParen: {
          i++;
          const top = peekTop();
          stack.push(tallyRolls());
          popStackIfNecessary(top);
          break;
        }
        case CoreTokenTypes.CloseParen:
          if (stack.length > 1)
            throw new Error(`Unexpected leftover tokens at position ${i}`);
          return popValue();
        case CoreTokenTypes.Operator:
          stack.push(token.operator);
          break;
        default:
          throw new ExhaustiveCaseError('Unknown token type', token);
      }
    }

    if (stack.length) popStack();
    return popValue();
  }

  return tallyRolls();
}

export default calculateFinalResult;
