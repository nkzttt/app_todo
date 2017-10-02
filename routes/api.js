const router = require('koa-router')();
const moment = require('moment');
moment.locale('ja');

// require api modules
const createDataList = require('../api/create-data-list');

// api test
router.post('/', async function (ctx, next) {
  ctx.status = 500;
  ctx.body = {message: 'error'};
});

// create data for list page
router.post('/create-data/list', async function (ctx, next) {
  ctx.body = createDataList(ctx.request.body);
});

module.exports = router;
