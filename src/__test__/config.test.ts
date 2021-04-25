import createDiceRoller from '../createDiceRoller';
import { DiceRule } from '../rules/types';
import withPlugins from '../withPlugins';

describe('configuration', () => {
  describe('random', () => {
    it('should be able to configure `random`', () => {
      const config = { random: () => 5 };
      const { roll } = createDiceRoller(withPlugins(), config);
      expect(roll('1d6 + 2d4 + 3d6').result).toEqual(30);
    });

    it('should be able to override `random` when rolling', () => {
      const config = { random: () => 5 };
      const { roll } = createDiceRoller(withPlugins(), config);

      const override = { random: () => 6 };
      expect(roll('1d6 + 2d4 + 3d6', override).result).toEqual(36);
    });
  });

  describe('context', () => {
    const variableRule: DiceRule<{ variableName: string }> = {
      regex: /[a-zA-Z][a-zA-Z0-9]*/,
      typeConstant: 'Variable',
      tokenize: (raw) => ({ variableName: raw }),
      roll: ({ variableName }, { context }) => {
        return [context[variableName]];
      },
      calculateValue: (_, roll) => roll[0],
    };

    it('should be able to configure `context`', () => {
      const config = { context: { myVar: 5 } };
      const { roll } = createDiceRoller(withPlugins(variableRule), config);
      expect(roll('myVar').result).toEqual(5);
    });

    it('should be able to override `context`', () => {
      const config = { context: { myVar: 5 } };
      const { roll } = createDiceRoller(withPlugins(variableRule), config);

      const override = { context: { myVar: 6 } };
      expect(roll('myVar', override).result).toEqual(6);
    });
  });
});
