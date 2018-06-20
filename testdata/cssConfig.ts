/*tslint:disable:no-implicit-dependencies*/
import { IStyleConfig } from '../index';

export const cssConfig: IStyleConfig = {
  postcssPlugins: [
    require('stylelint')({
      ignorePath: '/node_modules/**/*.css'
    }),
    require('autoprefixer')({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9' // React doesn't support IE8 anyway
      ]
    })
  ]
};
