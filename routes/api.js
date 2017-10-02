var router = require('koa-router')();

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
    additionData.todos.done = (() => {
      let doneNum = 0;
      data.todos.forEach((todo) => {
        if (todo.isDone) doneNum++;
      });
      return doneNum;
    })();

    newData.push(additionData);
  });

  ctx.body = newData;
});

module.exports = router;
