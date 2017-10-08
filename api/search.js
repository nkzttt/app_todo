module.exports = (postData) => {

  /*
   * postData.data内のnameプロパティにpostData.searchStrをひっかける
   * postData.dataにはリストのnameプロパティと、各todoのnameプロパティが存在する
   * レスポンスデータは以下の型とする
   *
   * {
          list: [
            {
              index: 0,
              name: 'やることリスト',
              timeCreated: '20000901'
            }
          ],
          todos: [
            {
              listIndex: 0,
              index: 0,
              listName:, 'やることリスト',
              name: 'やること１',
              "timeCreated": "20000921",
              "timeLimit": "20000930"
            },
            {
              listIndex: 0,
              index: 1,
              listName:, 'やることリスト',
              name: 'やること２',
              "timeCreated": "20000921",
              "timeLimit": "20000930"
            }
          ]
        }
   */

  const searchRegStr = new RegExp(postData.searchStr);
  const hitList = [];
  const hitTodos = [];

  // search the list
  postData.data.forEach((data, i) => {
    let isHit = searchRegStr.test(data.name);

    if (!isHit) return;

    // ignore this data if all todoItems in the data has done.
    if (postData.ignoreDoneItem) {

      const hasAllDone = data.todos.every(({isDone}) => {
        return isDone;
      });

      if (hasAllDone) return;
    }

    data.index = i;
    hitList.push(data);
  });

  // search todos in the list
  postData.data.forEach((data, listIndex) => {
    let listName = data.name;

    data.todos.forEach((todo, i) => {
      let isHit = searchRegStr.test(todo.name);

      if (!isHit) return;

      // ignore this data if it has done.
      if (postData.ignoreDoneItem && todo.isDone) return;

      todo.listIndex = listIndex;
      todo.listName = listName;
      todo.index = i;
      hitTodos.push(todo);
    });
  });


  return {
          list: hitList,
          todos: hitTodos
        };

};
