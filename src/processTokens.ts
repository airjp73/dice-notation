import { Token, CoreTokenTypes, OperatorToken, DiceRollToken } from './tokens';
import ExhaustiveCaseError from './ExhaustiveCaseError';
import { getPrecedence, Operator } from './operators';
import simpleDieRoll from './rules/simpleDieRoll';
import constant from './rules/constant';
import { RollResults } from './rules/types';

const plugins = {
  [simpleDieRoll.typeConstant]: simpleDieRoll,
  [constant.typeConstant]: constant,
};

function rollDice(tokens: Token[]): RollResults {
  return tokens.map(token => {
    switch (token.type) {
      case CoreTokenTypes.CloseParen:
      case CoreTokenTypes.OpenParen:
      case CoreTokenTypes.Operator:
        return null;
      case CoreTokenTypes.DiceRoll:
        return plugins[token.type].roll(token.detail);
    }
  });
}

export type ValueOrOperatorToken = number | Exclude<Token, DiceRollToken>;

export function tallyRolls(
  tokens: Token[],
  rolls: RollResults
): ValueOrOperatorToken[] {
  return tokens.map((token, index) => {
    switch (token.type) {
      case CoreTokenTypes.CloseParen:
      case CoreTokenTypes.OpenParen:
      case CoreTokenTypes.Operator:
        if (rolls[index])
          throw new Error(
            `Roll result array does not match provided tokens. Got results but expected null at position ${index}`
          );
        return token;
      case CoreTokenTypes.DiceRoll:
        const rollsForToken = rolls[index];
        if (!rollsForToken)
          throw new Error(
            `Roll result array does not match provided tokens. Got null but expected results at position ${index}`
          );
        return plugins[token.type].calculateValue(token.detail, rollsForToken);
    }
  });
}

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

type ValueOrOperatorString = number | Operator;

function calculateFinalResult(
  tokens: Token[],
  values: ValueOrOperatorToken[]
): number {
  let i = 0;

  function tallyRolls() {
    let stack: ValueOrOperatorString[] = [];

    const isOperator = (
      stackItem: ValueOrOperatorString
    ): stackItem is Operator => typeof stackItem === 'string';
    const isValue = (stackItem: ValueOrOperatorString): stackItem is number =>
      typeof stackItem === 'number';

    const peekTop = () => stack[stack.length - 1];

    const popValue = (): number => {
      const top = stack.pop();
      if (!top)
        throw new Error('Expected dice roll or constant but got nothing');
      if (isOperator(top))
        throw new Error('Expected dice roll or constant but got operator');
      return top;
    };

    const popOperator = (): Operator => {
      const top = stack.pop();
      if (!top) throw new Error('Expected operator but got nothing');
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

    for (; i < tokens.length; i++) {
      let token = tokens[i];

      switch (token.type) {
        case CoreTokenTypes.DiceRoll: {
          const top = peekTop();
          stack.push(top);
          const lookAhead = tokens[i + 1];
          if (
            top &&
            isOperator(top) &&
            (!lookAhead ||
              lookAhead.type !== CoreTokenTypes.Operator ||
              getPrecedence(top) <= getPrecedence(lookAhead.operator))
          ) {
            popStack();
          }
          break;
        }
        case CoreTokenTypes.CloseParen:
          if (stack.length > 1)
            throw new Error(`Unexpected leftover tokens at position ${i}`);
          return popValue();
        case CoreTokenTypes.OpenParen: {
          i++;
          const top = peekTop();
          // recurse?
          stack.push(tallyRolls());
          const lookAhead = tokens[i + 1];
          if (
            top &&
            isOperator(top) &&
            (!lookAhead ||
              lookAhead.type !== CoreTokenTypes.Operator ||
              getPrecedence(top) <= getPrecedence(lookAhead.operator))
          ) {
            popStack();
          }
          break;
        }
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
