import createGenerateRolls from './generateRolls';
import random, { Random } from './random';

export interface RollConfig {
  random: Random;
  generateRolls: (numDice: number, diceSize: number) => number[];
  context: Record<string, any>;
}

export interface RollConfigOptions {
  random: Random;
  context: Record<string, any>;
}

export const getDefaultRollConfigOptions = (
  helpers: Partial<RollConfigOptions> = {}
): RollConfigOptions => {
  const configuredRandom = helpers.random ?? random;
  const configuredContext = helpers.context ?? {};

  return {
    random: configuredRandom,
    context: configuredContext,
  };
};

export const getFinalRollConfig = (
  config: RollConfigOptions,
  overrides: Partial<RollConfigOptions> = {}
): RollConfig => {
  const finalConfig = {
    ...config,
    ...overrides,
  };
  return {
    ...finalConfig,
    generateRolls: createGenerateRolls(finalConfig.random),
  };
};
