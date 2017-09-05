const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const ejs = require('ejs');

const config = require('./config');
// const redis = require('./services/redis');
const router = require('./routes');
const proxy = require('./services/proxy');
const error = require('./services/error');

const app = express();

app.set('env', config.env);
// view engine setup
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, config.env === 'development' ? 'views-dev' : 'views-pro'));
app.set('view engine', 'html');
app.set('trust proxy', true);
app.set('x-powered-by', false);

// uncomment after placing your favicon in /public
app.use(express.static(path.join(__dirname, 'public'), { dotfiles: 'allow' }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(compression());
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet({
  noSniff: false
}));

// init redis
// redis.init(app);

// init router
router.init(app);

// init proxy
proxy.init(app);

// init error handlers
error.init(app);

// locals
app.locals.__public_path__ = config.publicPath;

module.exports = app;
