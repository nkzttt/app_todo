module.exports = (postData) => {

  console.dir(postData);

  return {
          list: [
            {
              name: 'やることリスト',
              timeCreated: '20000901'
            }
          ],
          todos: [
            {
              listIndex: 0,
              name: 'やること１',
              "timeCreated": "20000921",
              "timeLimit": "20000930"
            },
            {
              listIndex: 0,
              name: 'やること２',
              "timeCreated": "20000921",
              "timeLimit": "20000930"
            }
          ]
        };

};
