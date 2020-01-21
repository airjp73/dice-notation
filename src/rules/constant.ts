import { DiceRule } from './types';

export const CONSTANT = '_Constant';

const constant: DiceRule<number> = {
  regex: /\d+/,
  typeConstant: CONSTANT,
  tokenize: raw => parseInt(raw),
  calculateValue: token => ({ result: token, rolls: [] }),
};

export default constant;
