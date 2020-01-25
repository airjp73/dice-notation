import { Plugins, DiceRule } from './rules/types';
import createDiceRoller, { defaultPlugins } from './createDiceRoller';

function withPlugins(...plugins: DiceRule<any>[]) {
  const customPlugins: Plugins = {};
  plugins.forEach(plugin => {
    customPlugins[plugin.typeConstant] = plugin;
  });

  // order matters, more specific rules must be dumped in _first_
  const allPlugins: Plugins = { ...customPlugins, ...defaultPlugins };

  return createDiceRoller(allPlugins);
}

export default withPlugins;
