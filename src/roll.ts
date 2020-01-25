import { RollResults } from './rules/types';
import createRollDice from './rollDice';
import createTallyRolls, { RollTotal } from './tallyRolls';
import calculateFinalResult from './calculateFinalResult';
import createTokenize from './tokenize';

export interface RollInformation {
  rolls: RollResults;
  rollTotals: RollTotal[];
  result: number;
}

function createRoll(
  tokenize: ReturnType<typeof createTokenize>,
  rollDice: ReturnType<typeof createRollDice>,
  tallyRolls: ReturnType<typeof createTallyRolls>
) {
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

  return roll;
}

export default createRoll;
