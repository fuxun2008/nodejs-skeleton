const xss = require('xss-filters');
const querystring = require('querystring');

const qsArray = ['auth', 'v_auth', 'myclient', 'mode'];
exports.qsArray = qsArray;

const log = message => {
  console.log(message);
};
exports.log = log;

exports.createGuid = () => {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
};

exports.stringify = object => querystring.stringify(object);

exports.stringifyQs = (query, keys, initial) => querystring.stringify(
  keys.reduce((o, k) => {
    if (query[k]) {
      o[k] = query[k];
    }
    return o;
  }, initial || {})
);

exports.stringifyQsAll = (query, initial) => {
  const queryObject = {};

  if (!initial) {
    initial = {};
  }

  for (const q in query) {
    if (query[q]) {
      queryObject[q] = exports.xssFilter(query[q]);
    }
  }

  for (const i in initial) {
    if (initial[i]) {
      queryObject[i] = exports.xssFilter(initial[i]);
    }
  }

  return exports.xssFilter(querystring.stringify(queryObject));
};

exports.xssFilter = s => {
  if (typeof s === 'string') {
    return xss.inHTMLData(xss.inSingleQuotedAttr(xss.inDoubleQuotedAttr(s)));
  }

  for (const i in s) {
    if (s[i]) {
      s[i] = exports.xssFilter(s[i]);
    }
  }

  return s;
};

/**
 * 获取ua中的myclient
 * @Author   Xun.Fu
 * @Datetime 2017-06-15
 * @param    {string}   ua  userAgent字串
 * @return   {string}       myclient字串
 */
exports.getMeetYouClientFromUA = ua => {
  if (!ua) {
    return null;
  }
  const m = ua.match(/MeetYouClient\/([\d.]*)([\s]+)([(]+)([\d]*)([)+])/);
  if (m) {
    return m[4];
  }
  return null;
};

/**
 * 数据错误跳转及参数传递
 * @Author   Xun.Fu
 * @Datetime 2017-06-15
 * @param    {object}   error   错误栈
 * @param    {object}   req     request对象
 * @return   {object}           错误页面默认参数
 */
exports.failData = (error, req) => {
  log(error.stack);
  const query = req.query;
  const qs = exports.stringifyQs(query, qsArray);
  const myclient = req.headers.myclient || query.myclient;
  const host = '';
  return {
    status: 'error',
    data: {},
    query,
    qs,
    host,
    message: error.message,
    appid: req._appid,
    myclient: myclient
  };
};

exports.composeHeaders = query => {
  const headers = new Headers();
  qsArray.forEach(hd => {
    if (query[hd]) {
      if (hd === 'auth') {
        headers.append('Authorization', 'XDS ' + query[hd]);
      } else if (hd === 'v_auth') {
        headers.append('Authorization-Virtual', 'VDS ' + query[hd]);
      } else {
        headers.append(hd, query[hd]);
      }
    }
  });

  return headers;
};
