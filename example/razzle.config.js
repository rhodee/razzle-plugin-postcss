const modifyBuilder = require('razzle-plugin-postcss').default

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
  plugins: [{ func: modify }]
}
