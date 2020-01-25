import { Plugins } from './rules/types';
import createRollDice from './rollDice';
import createTallyRolls from './tallyRolls';
import calculateFinalResult from './calculateFinalResult';
import createRoll from './roll';
import createTokenize from './tokenize';
import simpleDieRoll from './rules/simpleDieRoll';
import constant from './rules/constant';

export const defaultPlugins = {
  [simpleDieRoll.typeConstant]: simpleDieRoll,
  [constant.typeConstant]: constant,
};

function createDiceRoller(plugins: Plugins = defaultPlugins) {
  const tokenize = createTokenize(plugins);
  const rollDice = createRollDice(plugins);
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
