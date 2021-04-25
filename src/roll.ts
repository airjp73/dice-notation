import { RollResults } from './rules/types';
import createRollDice from './rollDice';
import createTallyRolls, { RollTotal } from './tallyRolls';
import calculateFinalResult from './calculateFinalResult';
import createTokenize from './tokenize';
import { Token } from './tokens';
import { RollConfigOptions, getFinalRollConfig } from './util/rollConfig';

export interface RollInformation {
  tokens: Token[];
  rolls: RollResults;
  rollTotals: RollTotal[];
  result: number;
}

function createRoll(
  tokenize: ReturnType<typeof createTokenize>,
  rollDice: ReturnType<typeof createRollDice>,
  tallyRolls: ReturnType<typeof createTallyRolls>,
  rollConfig: RollConfigOptions
) {
  function roll(
    notation: string,
    configOverrides?: Partial<RollConfigOptions>
  ): RollInformation {
    const finalConfig = getFinalRollConfig(rollConfig, configOverrides);
    const tokens = tokenize(notation, finalConfig);
    const rolls = rollDice(tokens, finalConfig);
    const rollTotals = tallyRolls(tokens, rolls, finalConfig);
    const result = calculateFinalResult(tokens, rollTotals);
    return {
      tokens,
      rolls,
      rollTotals,
      result,
    };
  }

  return roll;
}

export default createRoll;
