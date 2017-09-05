const webpack = require('webpack');
const bs = require('browser-sync').create();

const webpackConfig = require('./webpack');

webpackConfig.devtool = 'source-map';

const compiler = webpack(webpackConfig);

// to watch /asssets
compiler.watch({
  aggregateTimeout: 300
}, (err, stats) => {
  console.log(err || '[webpack]: build done!');
  console.log(stats.toString());
});

// start browser-sync
bs.init({
  port: '6666',
  proxy: 'http://localhost:6140',
  files: ['public/assets/*.js', 'public/assets/*.css', 'views-dev/*.html']
});
