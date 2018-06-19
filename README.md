# razzle-plugin-postcss

[![CircleCI](https://circleci.com/gh/rhodee/razzle-plugin-postcss/tree/master.svg?style=shield)](https://circleci.com/gh/rhodee/razzle-plugin-postcss/tree/master)
![Razzle-status](https://david-dm.org/rhodee/razzle-plugin-postcss.svg?path=packages/razzle-plugin-postcss) [![npm version](https://badge.fury.io/js/razzle-plugin-postcss.svg)](https://badge.fury.io/js/razzle) [![Known Vulnerabilities](https://snyk.io/test/npm/razzle-plugin-postcss/badge.svg)](https://snyk.io/test/npm/razzle-plugin-postcss) [![Greenkeeper badge](https://badges.greenkeeper.io/rhodee/razzle-plugin-postcss.svg)](https://greenkeeper.io/)

A [Razzle](https://github.com/jaredpalmer/razzle) 2.x [plugin](https://github.com/jaredpalmer/razzle/tree/master/packages) for generating configuraable progressive web applications and web application manifests.

## Usage

Example options for each plugin can be found inside of [testdata]('testdata'). Once you have your desired options, pass it to `modify` which will return a Razzle plugin compliant modify function. It just works.

```javascript
  // razzle.config.js

  const modifyBuilder = require('razzle-plugin-postcss')
  const cssConfig = {
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
  ],
  filename: '[name].css',
  chunkFilename: '[contenthash:8].css'
}
  const modify = modifyBuilder({ cssConfig })

  module.exports = {
    plugins: [modify]
  }
```

### Configuration options

All available configuration options are defined in their respective repositories, which can be found searching on npm or at [PostCSS](https://postcss.org/).
