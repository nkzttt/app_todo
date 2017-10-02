var router = require('koa-router')();

// api test
router.post('/', async function (ctx, next) {
  ctx.status = 500;
  ctx.body = {message: 'error'};
});

// create data for list page
router.post('/', async function (ctx, next) {
  ctx.body = {result: 'success'};
});

module.exports = router;
