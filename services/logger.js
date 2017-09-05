const tools = require('./tools');

exports.log = (err, req) => {
  console.error({
    type: 'error',
    message: err.message,
    detail: err.stack,
    request_url: req.url,
    request_host: req.hostname,
    request_ua: req.headers['user-agent'],
    request_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    request_id: req._rid || tools.createGuid()
  });
};
