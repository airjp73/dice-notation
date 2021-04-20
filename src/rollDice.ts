import { Plugins, RollResults } from './rules/types';
import { CoreTokenTypes, Token } from './tokens';

function createRollDice(plugins: Plugins, random: (min: number, max: number) => number) {
  function rollDice(tokens: Token[]): RollResults {
    return tokens.map(token => {
      switch (token.type) {
        case CoreTokenTypes.CloseParen:
        case CoreTokenTypes.OpenParen:
        case CoreTokenTypes.Operator:
          return null;
        case CoreTokenTypes.DiceRoll:
          return plugins[token.detailType].roll(token.detail, random);
      }
    });
  }

  return rollDice;
}

export default createRollDice;
