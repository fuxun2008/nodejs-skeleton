const config = require('../tools/config');

const host = config.dataApi;

const apiList = [
  ''
];

/* eslint no-return-assign: 0 */
apiList.map(api => exports[api] = `${host}/${api}`);
