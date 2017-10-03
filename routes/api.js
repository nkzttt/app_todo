const router = require('koa-router')();

// require api modules
const createDataList = require('../api/create-data-list');
const validateList = require('../api/validate-list');

// api test
router.post('/', async function (ctx, next) {
  ctx.status = 500;
  ctx.body = {message: 'error'};
});

// create data for list page
router.post('/create-data/list', async function (ctx, next) {
  ctx.body = createDataList(ctx.request.body);
});

// validate addition list
router.post('/validate/list', async function (ctx, next) {
  ctx.body = validateList(ctx.request.body);
});

// validate addition todoItem
router.post('/validate/item', async function (ctx, next) {
  // validator is same as used for the list, so replace strings from 'リスト' to 'アイテム'
  let errorMessage = validateList(ctx.request.body);
  if (errorMessage) {
    errorMessage = errorMessage.replace('リスト', 'アイテム');
  }

  ctx.body = errorMessage;
});

module.exports = router;
