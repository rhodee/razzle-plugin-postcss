import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as postcss from 'postcss'
import * as wp from 'webpack'

const postcssPlugins: any[] = []
/*tslint:disable-next-line:no-var-requires no-submodule-imports*/
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder')
const cssFinder = makeLoaderFinder('css-loader')

interface IModifyConfigTargetDevOptions {
  target: 'node' | 'web'
  dev: boolean
}

export interface IStyleConfig {
  postcssPlugins?: postcss.AcceptedPlugin[]
  cssFilename?: string
  cssChunkFilename?: string
}

interface IRazzleUserOptions {
  [name: string]: any
}

type IRazzleModifyFunc = (
  baseConfig: wp.Configuration,
  { target, dev }: IModifyConfigTargetDevOptions,
  webpack: wp.Compiler,
  userOptions: IRazzleUserOptions
) => wp.Configuration

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
    const cssPlugin = new MiniCssExtractPlugin({ filename: pluginConfig.cssFilename || '', chunkFilename: pluginConfig.cssChunkFilename })
    const config = { ...baseConfig }

    const currentCSSLoader = config.module && config.module.rules.find(cssFinder)

    if (currentCSSLoader) {
      // remove current CSS Loader
      (config.module as wp.Module).rules = (config.module as wp.Module).rules.filter(
        rule => !cssFinder(rule)
      )
      const nextCSSLoader: wp.Rule = { ...currentCSSLoader }

      if (dev) {
        nextCSSLoader.use = [
          target === 'node' ? '' : require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: false,
              sourceMap: true
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => postcssPlugins.concat(pluginConfig.postcssPlugins || []),
              syntax: 'postcss-scss'
            }
          }
        ]

        config && config.module && config.module.rules.push(nextCSSLoader)
      } else {

        config && config.plugins && config.plugins.push(cssPlugin)
        nextCSSLoader.use = [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              minimize: true
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => postcssPlugins.concat(pluginConfig.postcssPlugins || []),
              syntax: 'postcss-scss'
            }
          }
        ]

        config && config.module && config.module.rules.push(nextCSSLoader)
      }
    }

    return config
  }
}
