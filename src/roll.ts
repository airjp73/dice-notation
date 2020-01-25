import { RollResults } from './rules/types';
import {
  RollTotal,
  rollDice,
  tallyRolls,
  calculateFinalResult,
} from './processTokens';
import tokenize from './tokenize';

export interface RollInformation {
  rolls: RollResults;
  rollTotals: RollTotal[];
  result: number;
}

function roll(notation: string): RollInformation {
  const tokens = tokenize(notation);
  const rolls = rollDice(tokens);
  const rollTotals = tallyRolls(tokens, rolls);
  const result = calculateFinalResult(tokens, rollTotals);
  return {
    rolls,
    rollTotals,
    result,
  };
}

export default roll;
