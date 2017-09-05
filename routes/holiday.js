const handler = require('./handler');
// const config = require('../tools/config');

// const host = config.toolsApi;

exports.index = handler.create({
  api: '',
  page: 'holiday/index'
});
