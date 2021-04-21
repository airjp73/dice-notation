import { Plugins, RollResults } from './rules/types';
import { CoreTokenTypes, Token } from './tokens';
import { Random } from './util/random';

function createRollDice(plugins: Plugins, opts: { random: Random }) {
  function rollDice(tokens: Token[]): RollResults {
    return tokens.map((token) => {
      switch (token.type) {
        case CoreTokenTypes.CloseParen:
        case CoreTokenTypes.OpenParen:
        case CoreTokenTypes.Operator:
          return null;
        case CoreTokenTypes.DiceRoll:
          return plugins[token.detailType].roll(token.detail, opts);
      }
    });
  }

  return rollDice;
}

export default createRollDice;
