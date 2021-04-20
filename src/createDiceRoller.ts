import { Plugins } from './rules/types';
import createRollDice from './rollDice';
import createTallyRolls from './tallyRolls';
import calculateFinalResult from './calculateFinalResult';
import createRoll from './roll';
import createTokenize from './tokenize';
import simpleDieRoll from './rules/simpleDieRoll';
import constant from './rules/constant';
import defaultRandom from "./util/random"

export const defaultPlugins = {
  [simpleDieRoll.typeConstant]: simpleDieRoll,
  [constant.typeConstant]: constant,
};

function createDiceRoller(plugins: Plugins = defaultPlugins, random = defaultRandom) {
  const tokenize = createTokenize(plugins);
  const rollDice = createRollDice(plugins, random);
  const tallyRolls = createTallyRolls(plugins);

  return {
    tokenize,
    calculateFinalResult,
    rollDice,
    tallyRolls,
    roll: createRoll(tokenize, rollDice, tallyRolls),
  };
}

export default createDiceRoller;
