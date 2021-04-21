import { Plugins, DiceRule } from './rules/types';
import createDiceRoller, { defaultPlugins } from './createDiceRoller';
import defaultRandom, { Random } from "./util/random"

function withPlugins(...plugins: DiceRule<any>[]): ReturnType<typeof createDiceRoller>
function withPlugins(plugins: DiceRule<any>[], random?: Random): ReturnType<typeof createDiceRoller>
function withPlugins(...args: any[]): ReturnType<typeof createDiceRoller> {
  let plugins: DiceRule<any>[];
  let random = defaultRandom
  if (Array.isArray(args[0])) {
    plugins = args[0]
    random = args[1] ?? defaultRandom
  } else {
    plugins = args
  }
  const customPlugins: Plugins = {};
  plugins.forEach((plugin) => {
    customPlugins[plugin.typeConstant] = plugin;
  });

  // order matters, more specific rules must be dumped in _first_
  const allPlugins: Plugins = { ...customPlugins, ...defaultPlugins };

  return createDiceRoller(allPlugins);
}

export default withPlugins;
