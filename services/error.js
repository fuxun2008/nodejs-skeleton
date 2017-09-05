const errLog = require('./logger');

/* eslint no-unused-vars: 0 */
const init = app => {
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found.');
    err.status = 404;
    next(err);
  });

  // error handlers
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    // console.error(err.stack || err.message || err);
    errLog.log(err, req);

    res.render('error', {
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
    });
  });
};

module.exports = {
  init
};
