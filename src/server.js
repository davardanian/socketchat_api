const Koa = require('koa');
const bodyParser = require('koa-bodyparser')();
const compress = require('koa-compress')();
const cors = require('@koa/cors')();
const helmet = require('koa-helmet')();
const logger = require('koa-logger')();

const errorHandler = require('./middleware/error.middleware');
const applyApiMiddleware = require('./api');
const { isDevelopment } = require('./config');

const server = new Koa();

const Knex = require('knex');
const knexConfig = require('@ccwisp/chatdb').knexfile;

const { Model } = require('objection');

// Initialize knex.
const knex = Knex(knexConfig.development);

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
Model.knex(knex);

/**
 * Add here only development middlewares
 */
if (isDevelopment) {
  server.use(logger);
}

/**
 * Pass to our server instance middlewares
 */
server
  .use(errorHandler)
  .use(helmet)
  .use(compress)
  .use(cors)
  .use(bodyParser);

/**
 * Apply to our server the api router
 */
applyApiMiddleware(server);

module.exports = server;
