import * as moo from 'moo';
import { CoreTokenTypes, Token } from './tokens';
import { Operator } from './operators';
import simpleDieRoll from './rules/simpleDieRoll';
import constant from './rules/constant';

const plugins = {
  [simpleDieRoll.typeConstant]: simpleDieRoll,
  [constant.typeConstant]: constant,
};

function tokenize(notation: string): Token[] {
  const WHITE_SPACE = 'WHITE_SPACE';

  const lexer = moo.compile({
    [WHITE_SPACE]: /[ \t]+/,
    [CoreTokenTypes.Operator]: /\*|\/|\+|-/,
    [CoreTokenTypes.OpenParen]: '(',
    [CoreTokenTypes.CloseParen]: ')',
    [simpleDieRoll.typeConstant]: simpleDieRoll.regex,
    [constant.typeConstant]: constant.regex,
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
  if (!token.type) throw new Error('Unrecognized token');

  switch (token.type) {
    case CoreTokenTypes.Operator:
      return {
        type: CoreTokenTypes.Operator,
        position: token.col - 1,
        content: token.value,
        operator: token.value as Operator,
      };
    case CoreTokenTypes.OpenParen:
      return {
        type: CoreTokenTypes.OpenParen,
        position: token.col - 1,
        content: token.value,
      };
    case CoreTokenTypes.CloseParen:
      return {
        type: CoreTokenTypes.CloseParen,
        position: token.col - 1,
        content: token.value,
      };
    default:
      const rule = plugins[token.type];
      if (!rule) throw new Error(`Unrecognized token of type ${token.type}`);
      return {
        type: CoreTokenTypes.DiceRoll,
        content: token.value,
        position: token.col - 1,
        detailType: rule.typeConstant,
        detail: rule.tokenize(token.value),
      };
  }
}

export default tokenize;
