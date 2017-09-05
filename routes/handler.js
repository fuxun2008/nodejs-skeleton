const tools = require('../services/tools');
const http = require('../services/http');

const excludes = [
  'is_first'
];

const stringify = query => {
  const qs = Object.assign({}, query);

  if (excludes.length) {
    excludes.forEach(k => {
      if (qs[k]) {
        delete qs[k];
      }
    });
  }

  if (!qs.imycache_off) {
    qs.imycache_off = 1;
  }

  return tools.stringify(qs);
};

const updateResponseHeaders = res => {
  res.set({
    'Cache-Control': 'no-cache,no-store,must-revalidate',
    Expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
    Pragma: 'no-cache',
    'X-XSS-Protection': '1; mode=block'
  });
};

const defaultOptions = {
  process: (json, req) => {
    const query = req.query;
    let _json = json;

    if (!json) {
      _json = {};
    }

    if (json.code && json.message) {
      return tools.failData(new Error(json.message), req);
    }

    return {
      qs: stringify(query),
      query: tools.xssFilter(query),
      host: req.headers.host,
      data: _json
    };
  }
};

// options
// - api: string
// - page: string
// - process: Function
exports.create = optionsArg => {
  const options = Object.assign({}, defaultOptions, optionsArg);
  if (!options.api) {
    return (req, res) => {
      const query = req.query;
      if (options.hasCache) {
        updateResponseHeaders(res);
      }

      if (options.hasData) {
        return res.render(options.page, {
          qs: stringify(query),
          data: {},
          host: req.headers.host,
          query: tools.xssFilter(query)
        });
      }

      return res.render(options.page, {
        qs: stringify(query),
        host: req.headers.host,
        query: tools.xssFilter(query)
      });
    };
  }

  return (req, res) => {
    const query = req.query;
    const base = `${options.apiHost}${options.api}`;
    const search = options.query ?
      (tools.stringify(query) + options.query) : tools.stringify(query);
    const headers = tools.composeHeaders(query);
    updateResponseHeaders(res);
    http.fetch(`${base}?${search}`, { headers })
      .then(response => response.json())
      .then(json => res.render(options.page, options.process(json, req, options.page)))
      .catch(error => res.render(options.page, tools.failData(error, req)));
  };
};
