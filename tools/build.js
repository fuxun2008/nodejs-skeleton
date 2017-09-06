/**
 * Usage: `node ./tools/build MODULE_NAME`
 * Example: `node ./tools/build xiaoyou`
 */

const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
// const del = require('del');
const md5 = require('md5');
const csso = require('csso');
const uglify = require('uglify-js');
const minify = require('html-minifier').minify;

const config = require('./config');
const webpackConfig = require('./webpack');

const BASE = config.baseRoot;
const MODULE = ['common'];
const VIEWS_FROM = [];
const VIEWS_DEST = [];
const IMAGES_RE = [];
// const MODULE = process.argv[2] || '';
process.argv.forEach((val, index) => {
  if (index > 1) {
    MODULE.push(val);
  }
});
console.log(JSON.stringify(MODULE, null, 2));
// return;
const VIEWS_DEV = 'views-dev';
const VIEWS_PRO = 'views-pro';
// const VIEWS_FROM = path.resolve(BASE, VIEWS_DEV, MODULE);
// const VIEWS_DEST = path.resolve(BASE, VIEWS_PRO, MODULE);
for (let m = 0; m < MODULE.length; m++) {
  VIEWS_FROM.push(path.resolve(BASE, VIEWS_DEV, MODULE[m]));
  VIEWS_DEST.push(path.resolve(BASE, VIEWS_PRO, MODULE[m]));
  IMAGES_RE.push(new RegExp(`${MODULE[m]}/images/([^"'>]+).(jpe?g|png|svg|gif)`, 'ig'));
}
const ASSETS = path.join(BASE, 'public/assets');

const ASSETS_RE = /\/assets\/([^"'>]+)\.(css|js)/ig;
// const IMAGES_RE = new RegExp(`${MOD}/images/([^"'>]+).(jpe?g|png|svg|gif)`, 'ig');
const DOCTYPE_RE = /<!doctype html>/i;
const DOCTYPE = '<!doctype html>';

const ART = '][\\/][ ]E ]E `][` ``// [[]] ][_][';

const cdnPath = config.cdnPath;
const log = txt => console.log(`[${(new Date()).toLocaleString()}] ${txt}`);

const now = new Date();
const buildTime = `build: ${now.toLocaleString()}`;
// const banner = `/**\n * ${ART}\n * ${buildTime}\n */\n`;

const htmlOpts = {
  minifyCSS: true,
  minifyJS: true,
  collapseWhitespace: true,
  processScripts: ['text/template'],
  ignoreCustomFragments: [/<[%#]=?[\s\S]*?[%#]>/]
};

const filemap = {};

process.on('exit', code => {
  if (code === 1) {
    console.log(`build ${MODULE} failed!`);
  }
});

// log('Removing assets files.');
// del.sync(`${ASSETS}/**`);

// log('Creating assets directory.');
// fs.mkdirSync(ASSETS);

log('Runing webpack build.');
webpackConfig.output.publicPath = cdnPath;

webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin()
);

webpack(webpackConfig, err => {
  if (err) {
    return console.error(err);
  }

  log('Assets build success.');
  buildViews();
  return true;
});

function buildViews() {
  log('Start build views.');

  for (let j = 0; j < VIEWS_FROM.length; j++) {
    const views = fs.readdirSync(VIEWS_FROM[j]);
    for (let i = 0; i < views.length; i++) {
      if (views[i].endsWith('.html')) {
        processView(views[i], VIEWS_FROM[j], VIEWS_DEST[j], IMAGES_RE[j]);
      }
    }
  }
}

function processView(view, vfrom, vdest, vimage) {
  log(`Processing view: ${view}`);

  // raw content
  const html0 = fs.readFileSync(path.join(vfrom, view), 'utf8');

  // process css/js
  const html1 = html0.replace(ASSETS_RE, (match, filename, type) => {
    log(`Found assets: ${match}`);

    if (type === 'css') {
      return processCss(filename);
    } else if (type === 'js') {
      return processScript(filename, vimage);
    }
    return true;
  });

  // process images
  const html2 = html1.replace(vimage, (match, filename, type) => {
    log(`Found images: ${match}`);
    return processImages(match, filename, type);
  });

  // process banner
  const html3 = html2.replace(DOCTYPE_RE, `${DOCTYPE}<!--\n\n${ART}\n${buildTime}\n\n-->`);

  // minify and write to destination file
  fs.writeFileSync(path.join(vdest, view), minify(html3, htmlOpts));
}

function processCss(filename) {
  const fpath = path.join(ASSETS, `${filename}.css`);
  const css0 = fs.readFileSync(fpath, 'utf8');
  const css1 = '' + csso.minify(css0);
  const publicName = `${filename}-${md5(css1)}.css`;

  fs.writeFileSync(path.join(ASSETS, publicName), css1);
  fs.unlinkSync(path.join(ASSETS, `${filename}.css`));

  return `${cdnPath}${publicName}`;
}

function processScript(filename, imageRE) {
  const fpath = path.join(ASSETS, `${filename}.js`);
  const js0 = fs.readFileSync(fpath, 'utf8');

  const js1 = js0.replace(imageRE, (match, file, type) => {
    log(`Found images: ${match}`);
    return processImages(match, file, type);
  });

  const js2 = '' + uglify.minify(js1, { fromString: true }).code;
  const publicName = `${filename}-${md5(js2)}.js`;

  fs.writeFileSync(path.join(ASSETS, publicName), js2);
  fs.unlinkSync(path.join(ASSETS, `${filename}.js`));

  return `${cdnPath}${publicName}`;
}

function processImages(match, filename, type) {
  const fpath = path.join(`${BASE}/public`, match);
  const i0 = fs.readFileSync(fpath);
  const publicName = `${filename}-${md5(i0)}.${type}`;
  const writePath = path.join(ASSETS, publicName);

  if (!filemap[match]) {
    fs.writeFileSync(writePath, i0);
    filemap[match] = writePath;
  }

  return `${cdnPath}${publicName}`;
}
