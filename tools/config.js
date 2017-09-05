const path = require('path');

const cdnPath = '//static.xuyizhen.com/nodejs-skeleton/';

const baseRoot = path.join(__dirname, '..');
let publicPath = '/assets/';
let toolsApi = 'http://test-tools.seeyouyima.com';

let env = 'development';
const ENV = process.env.NODE_ENV;

const wechat = {
  appID: 'wxeb14210e81fa9877',
  appSecret: 'dc75395f48d75e71e9d4c50cb0f0b937'
};

const redisPublic = {
  host: '211.151.209.78',
  port: 6370,
  pass: 'AVPVs82aSq10PpFW0qgS3KFIL0AiSDPB'
};

if (ENV === 'production' || ENV === 'release' || ENV === 'test') {
  env = ENV;
  publicPath = cdnPath;

  if (env === 'test') {
    toolsApi = 'http://test-tools.seeyouyima.com';
  } else if (env === 'release') {
    toolsApi = 'http://yf-tools.seeyouyima.com';
  } else if (env === 'production') {
    toolsApi = 'http://tools.seeyouyima.com';
  }
}

exports.cdnPath = cdnPath;
exports.publicPath = publicPath;
exports.baseRoot = baseRoot;
exports.toolsApi = toolsApi;
exports.wechat = wechat;
exports.codisConf = redisPublic;
exports.env = env;
