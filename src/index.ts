import createDiceRoller from './createDiceRoller';

export { default as createDiceRoller } from './createDiceRoller';
export { default as withPlugins } from './withPlugins';
export { default as random } from './util/random';

export const {
  tokenize,
  calculateFinalResult,
  rollDice,
  tallyRolls,
  roll,
} = createDiceRoller();
