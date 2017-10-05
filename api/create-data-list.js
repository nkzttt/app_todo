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

    // get oldest limit day
    additionData.nearestLimit = (() => {
      if (!postData[i].todos.length) return null;

      const days = [];

      // ignore todoItem if isDone property is true
      postData[i].todos.forEach(({timeLimit, isDone}) => {
        if (!isDone) days.push(timeLimit);
      });

      // if all todoItems is done, return null.
      if (!days.length) return null;

      // return string
      return Math.min.apply(null, days) + '';
    })();

    // get newest todoItem for sort
    additionData.newestTodoNum = (() => {
      if (!postData[i].todos.length) return 0;

      const days = postData[i].todos.map(({timeCreated}) => {
        return parseInt(timeCreated, 10);
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
