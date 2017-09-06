const path = require('path');
const autoprefixer = require('autoprefixer');
const stylelint = require('stylelint');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./config');

const baseRoot = config.baseRoot;
const publicPath = config.publicPath;

const joinBaseRoot = file => path.join(baseRoot, file);

const webpackConfig = {
  entry: {
    holiday_index: joinBaseRoot('public/holiday/javascripts/index.js'),
    error: joinBaseRoot('public/common/javascripts/error.js')
  },
  output: {
    publicPath,
    path: joinBaseRoot('public/assets/'),
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  module: {
    loaders: [{
      test: /\.s?css$/,
      loader: ExtractTextPlugin.extract('style', 'css!sass!postcss')
    }, {
      test: /\.(png|svg|gif|jpe?g|icon?|eot|ttf|woff2?)$/,
      loader: 'url?limit=13312&name=[name]-[hash].[ext]'
    }, {
      test: /\.js$/,
      loader: 'eslint',
      exclude: [/node_modules/, /public\/assets/]
    }, {
      test: /\.jsx$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['react', 'stage-0', 'es2015']
      }
    }, {
      test: /\.vue$/,
      loader: 'vue'
    }]
  },
  postcss: [
    stylelint(),
    autoprefixer({
      browsers: ['last 5 versions', '> 0%']
    })
  ],
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  resolve: {
    // require时省略的扩展名，遇到.vue结尾的也要去加载
    extensions: ['', '.js', '.vue'],
    // 模块别名地址，方便后续直接引用别名，无须写长长的地址，注意如果后续不能识别该别名，需要先设置root
    root: '../node_modules',
    alias: {
      vue$: 'vue/dist/vue.js'
    }
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ]
};

module.exports = webpackConfig;
