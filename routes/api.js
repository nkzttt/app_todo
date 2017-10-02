const router = require('koa-router')();
const moment = require('moment');
moment.locale('ja');

// api test
router.post('/', async function (ctx, next) {
  ctx.status = 500;
  ctx.body = {message: 'error'};
});

// create data for list page
router.post('/create-data/list', async function (ctx, next) {
  const postData = ctx.request.body;
  let newData = [];

  postData.forEach((data) => {
    let additionData = {};
    additionData.name = data.name;
    additionData.todos = {};
    additionData.todos.total = data.todos.length;

    // count done todos.
    additionData.todos.done = (() => {
      let doneNum = 0;
      data.todos.forEach((todo) => {
        if (todo.isDone) doneNum++;
      });
      return doneNum;
    })();

    // get nearest limit day, and it format by moment
    additionData.nearestLimit = (() => {
      let days = [];
      data.todos.forEach((todo) => {
        const dayNum = parseInt(todo.timeLimit, 10);
        days.push(dayNum);
      });
      let maxDayNum = Math.max.apply(null, days);
      return moment(maxDayNum + '').format('YYYY年MM月DD日');
    })();

    newData.push(additionData);
  });

  ctx.body = newData;
});

module.exports = router;
