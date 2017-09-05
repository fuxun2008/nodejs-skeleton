require('isomorphic-fetch');
require('es6-promise');

const holiday = require('./holiday');

exports.init = app => {
  app.get('/', holiday.index);
  app.get('/holiday', holiday.index);
  app.get('/holiday/index', holiday.index);

  return app;
};
