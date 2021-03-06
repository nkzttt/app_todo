const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

const api = require('./routes/api');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'ect',
  options: {
    root: __dirname + '/views',
    ext : '.ect'
  }
}));

// for development
if (process.env.NODE_ENV === 'development') {}

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// return object for 'ctx.state' after merge.
app.context.createState = (state) => {
  const commonState = {
    env: process.env.NODE_ENV
  };
  return Object.assign({}, commonState, state);
};

// routing
router.get('/', async function (ctx, next) {
  ctx.state = ctx.createState({
    title: 'TODOリスト'
  });

  await ctx.render('index');
});

router.use('/api', api.routes(), api.allowedMethods());

app.use(router.routes(), router.allowedMethods());

app.on('error', function(err, ctx){
  console.log(err);
  logger.error('server error', err, ctx);
});


module.exports = app;