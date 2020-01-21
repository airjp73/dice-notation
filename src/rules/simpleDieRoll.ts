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
  calculateValue: token => {
    const { count, numSides } = token;
    const rolls: number[] = new Array(count).map(() => random(1, numSides));
    const result = rolls.reduce((agg, num) => agg + num, 0);
    return { result, rolls };
  },
};

export default simpleDieRoll;
