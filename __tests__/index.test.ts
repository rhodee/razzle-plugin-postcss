import modify from '../index';
import { cssConfig } from '../testdata/cssConfig';

/*tslint:disable-next-line:no-var-requires no-submodule-imports*/
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');

const cssFinder = makeLoaderFinder('css-loader');
/*tslint:disable-next-line:no-var-requires no-submodule-imports*/
const createConfig = require('razzle/config/createConfig');

describe('razzle-plugin-postcss', () => {
  describe('properly configured', () => {
    it('appends loaders to vanilla CSS loader defaults and adds support for SCSS syntax', () => {
      const pluginFunc = modify({
        postcssPlugins: cssConfig.postcssPlugins
      });
      const config = createConfig('web', 'dev', {
        plugins: [{ func: pluginFunc, options: { useBabel: false } }]
      });

      const currentCSSLoader =
        config.module && config.module.rules.find(cssFinder);
      const loader = currentCSSLoader.use.find(
        ruleItem =>
          typeof ruleItem === 'object' &&
          ruleItem.loader.match('postcss-loader')
      );
      expect(loader.options.syntax).toBe('postcss-scss');
    });
  });
});
