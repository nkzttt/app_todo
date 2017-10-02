const moment = require('moment');
moment.locale('ja');

module.exports = (postData) => {

  let newData = [];

  for (let i=0; i<postData.length; i++) {
    let additionData = {};
    additionData.index = i;
    additionData.name = postData[i].name;
    additionData.todos = {};
    additionData.todos.total = postData[i].todos.length;

    // count done todos.
    additionData.todos.done = (() => {
      if (!postData[i].todos.length) return 0;

      let doneNum = 0;
      postData[i].todos.forEach((todo) => {
        if (todo.isDone) doneNum++;
      });
      return doneNum;
    })();

    // get nearest limit day, and it format by moment
    additionData.nearestLimit = (() => {
      if (!postData[i].todos.length) return null;

      const days = postData[i].todos.map(({timeLimit}) => {
        return parseInt(timeLimit, 10);
      });
      const maxDayNum = Math.max.apply(null, days);
      return moment(maxDayNum + '').format('YYYY年MM月DD日');
    })();

    // get newest todoItem for sort
    additionData.newestTodoNum = (() => {
      if (!postData[i].todos.length) return 0;

      const days = postData[i].todos.map(({timeLimit}) => {
        return parseInt(timeLimit, 10);
      });
      return Math.max.apply(null, days);
    })();

    newData.push(additionData);

  }

  // sort by timeCreated
  newData.sort((a, b) => {
    return b.newestTodoNum - a.newestTodoNum;
  });

  return newData;

};
