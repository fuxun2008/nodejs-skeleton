const redis = require('redis');
const redisInfo = require('../tools/config').codisConf;

exports.init = app => {
  const client = redis.createClient(redisInfo.port, redisInfo.host, {});

  if (redisInfo.pass) {
    client.auth(redisInfo.pass);
  }

  client.on('error', err => {
    console.log(`Redis: ${JSON.stringify(err, null, 2)}`);
  });

  client.on('connect', () => {
    console.log('Redis connected');
  });

  app.redis = client;
};
