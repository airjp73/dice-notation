import { DiceRule } from './types';
import { CoreTokenTypes } from '../tokens';

const constant: DiceRule<number> = {
  regex: /\d+/,
  typeConstant: CoreTokenTypes.Constant,
  tokenize: raw => parseInt(raw),
  roll: () => [],
  calculateValue: token => token,
};

export default constant;
