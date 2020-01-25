import { Plugins } from './rules/types';
import createDiceRoller, { defaultPlugins } from './createDiceRoller';

function withPlugins(plugins: Plugins) {
  return createDiceRoller({ ...defaultPlugins, ...plugins });
}

export default withPlugins;
