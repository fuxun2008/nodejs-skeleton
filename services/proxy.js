const proxy = require('http-proxy-middleware');
const config = require('../tools/config');

const proxies = [
  'tools'
];

const init = app => {
  proxies.forEach(api => {
    const apiPath = `/${api}-api`;
    const apiName = api.replace(/-(\w)/g, (m, c) => c.toUpperCase());
    const target = config[`${apiName}Api`];
    const pathRewrite = {};

    pathRewrite[apiPath] = '';
    app.use(proxy(apiPath, {
      target,
      changeOrigin: true,
      pathRewrite
    }));
  });
};

module.exports = {
  init
};
