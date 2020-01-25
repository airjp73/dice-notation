import createDiceRoller from './createDiceRoller';

export { default as createDiceRoller } from './createDiceRoller';
export { default as withPlugins } from './withPlugins';

export const {
  tokenize,
  calculateFinalResult,
  rollDice,
  tallyRolls,
  roll,
} = createDiceRoller();
