import { DiceRule } from './types';
import random from '../util/random';

export const SIMPLE_DIE_ROLL = '_SimpleDieRoll';

export interface SimpleDiceRollToken {
  count: number;
  numSides: number;
}

const simpleDieRoll: DiceRule<SimpleDiceRollToken> = {
  regex: /\d+d\d+/,
  typeConstant: SIMPLE_DIE_ROLL,
  tokenize: raw => {
    const [count, numSides] = raw.split('d').map(num => parseInt(num));
    return { count, numSides };
  },
  roll: ({ count, numSides }) =>
    new Array(count).fill(0).map(() => random(1, numSides)),
  calculateValue: (token, rolls) => rolls.reduce((agg, num) => agg + num, 0),
};

export default simpleDieRoll;
