import type { Plugins } from './rules/types';
import createRollDice from './rollDice';
import createTallyRolls from './tallyRolls';
import calculateFinalResult from './calculateFinalResult';
import createRoll from './roll';
import createTokenize from './tokenize';
import simpleDieRoll from './rules/simpleDieRoll';
import constant from './rules/constant';
import {
  getDefaultRollConfigOptions,
  RollConfig,
  RollConfigOptions,
} from './util/rollConfig';

export const defaultPlugins = {
  [simpleDieRoll.typeConstant]: simpleDieRoll,
  [constant.typeConstant]: constant,
};

function createDiceRoller(
  plugins: Plugins = defaultPlugins,
  configOverrides: Partial<RollConfigOptions> = {}
) {
  const rollConfig = getDefaultRollConfigOptions(configOverrides);
  const { tokenize, tokenizeFaultTolerant } = createTokenize(
    plugins,
    rollConfig
  );
  const rollDice = createRollDice(plugins, rollConfig);
  const tallyRolls = createTallyRolls(plugins, rollConfig);

  return {
    tokenize,
    tokenizeFaultTolerant,
    calculateFinalResult,
    rollDice,
    tallyRolls,
    roll: createRoll(tokenize, rollDice, tallyRolls, rollConfig),
  };
}

export type DiceRoller = ReturnType<typeof createDiceRoller>;

export default createDiceRoller;
