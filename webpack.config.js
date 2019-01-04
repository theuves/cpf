const path = require('path')
const UglifyjsPlugin = require('uglifyjs-webpack-plugin')
const BannerPlugin = require('webpack').BannerPlugin
const { name, version, author } = require('./package.json')

const banner = `${name} v${version} | (c) 2015-${(new Date()).getFullYear()} by ${author}`

module.exports = {
  entry: {
    'cpf': './index.js',
    'cpf.min': './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'CPF',
    libraryTarget: 'umd',

    // To solve a problem with Webpack 4 (webpack#6522).
    globalObject: `typeof self !== 'undefined' ? self : this`
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: [
          'env'
        ]
      }
    }]
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new UglifyjsPlugin({
      include: /\.min\.js$/,
      uglifyOptions: {
        output: {
          comments: false,
        }
      }
    }),
    new BannerPlugin(banner)
  ],
  stats: {
    colors: true
  }
}
