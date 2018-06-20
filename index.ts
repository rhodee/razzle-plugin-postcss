import * as postcss from 'postcss';
import * as wp from 'webpack';

/*tslint:disable-next-line:no-var-requires no-submodule-imports*/
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');
const cssFinder = makeLoaderFinder('css-loader');

interface IModifyConfigTargetDevOptions {
  target: 'node' | 'web';
  dev: boolean;
}

export interface IStyleConfig {
  cssChunkFilename?: string;
  cssFilename?: string;
  postcssPlugins?: postcss.AcceptedPlugin[];
}

interface IRazzleUserOptions {
  [name: string]: any;
}

type IRazzleModifyFunc = (
  baseConfig: wp.Configuration,
  { target, dev }: IModifyConfigTargetDevOptions,
  webpack: wp.Compiler,
  userOptions: IRazzleUserOptions
) => wp.Configuration;

/**
 * @param {IModifyConfigOption} pluginConfig - configuration objects for postcss and scss loaders.
 * @description returns a function which closes over the pluginConfig and returns an object that can
 * be passed along to razzle.
 * @returns IRazzleModifyFunc
 */
export default (pluginConfig: IStyleConfig): IRazzleModifyFunc => {
  return (
    baseConfig: wp.Configuration,
    { target, dev }: IModifyConfigTargetDevOptions,
    webpack: wp.Compiler,
    userOptions = {}
  ) => {
    const config = { ...baseConfig };
    const currentCSSLoader =
      config.module && config.module.rules.find<wp.RuleSetRule>(cssFinder);

    if (currentCSSLoader) {
      const loaderIdx = (config.module as wp.Module).rules.indexOf(
        currentCSSLoader
      );
      const ruleArray =
        currentCSSLoader && currentCSSLoader.use && currentCSSLoader.use;
      let nextCSSLoader: wp.RuleSetRule = { ...currentCSSLoader };

      if (Array.isArray(ruleArray)) {
        const loaderContainer: any = ruleArray.find(ruleItem => {
          if (ruleItem && typeof ruleItem === 'object') {
            if (ruleItem.loader) {
              if (ruleItem.loader.match('postcss-loader')) return true;
            }
          }
          return false;
        });

        if (loaderContainer) {
          const ruleIdx = ruleArray.indexOf(loaderContainer);
          loaderContainer.options = {
            ...loaderContainer.options,
            plugins: pluginConfig.postcssPlugins,
            syntax: 'postcss-scss'
          };

          if (nextCSSLoader.use) {
            if (Array.isArray(nextCSSLoader.use)) {
              nextCSSLoader.use[ruleIdx] = loaderContainer;
            }
          } else {
            nextCSSLoader = {
              use: [loaderContainer]
            };
          }

          if (config.module) {
            config.module.rules[loaderIdx] = nextCSSLoader;
          }
        }

        return config;
      }
    }

    return config;
  };
};
