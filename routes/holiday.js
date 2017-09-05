const handler = require('./handler');
const config = require('../tools/config');

const host = config.dataApi;

exports.index = handler.create({
  api: `${host}/v2/tools_for_common`,
  page: 'holiday/index'
});
