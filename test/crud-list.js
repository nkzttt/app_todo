const assert = require('assert');
const {Selector} = require('testcafe');

const sampleData = require('../src/sample.json');

fixture('check crud of list page')
  .page('http://localhost:3001');

// sample.jsonの中から、１つのTODOリストが表示されている
test('can see todoList', async t => {
  const todoListName = sampleData[0].name;
  const todoList = Selector('.listDetail__title__linkText');
  const countTodoList = await todoList.count;
  const titles = [];

  for (let i=0; i<countTodoList; i++) {
    const title = await todoList.nth(i)().innerText;
    titles.push(title.trim());
  }

  assert(titles.includes(todoListName));
});

// TODOリストの新規追加と削除ができる
test('can add and remove todoList', async t => {
  // 新規追加処理
  const newTodoListName = '新しいリスト';
  const input = Selector('.addList__input').child('input[type="text"]');
  const submit = Selector('.addList__submit').child('button');

  await t
    .typeText(input, newTodoListName)
    .click(submit);

  // 追加された要素の確認
  const todoList = Selector('.listDetail__title__linkText');
  const countTodoList = await todoList.count;
  const titles = [];

  for (let i=0; i<countTodoList; i++) {
    const title = await todoList.nth(i)().innerText;
    titles.push(title.trim());
  }

  assert(titles.includes(newTodoListName));

  // 追加された要素の削除
  const deleteBtn = Selector('.listDetail__delete').nth(countTodoList - 1).child('button');

  await t.click(deleteBtn);

  // 削除後の数の確認
  const countTodoListAfterDel = await todoList.count;

  assert(countTodoListAfterDel === countTodoList - 1);
});

// TODOリストの名前編集ができる
test('can edit todoList', async t => {
  // 編集処理
  const editTodoListName = '編集リスト';
  const editBtn = Selector('.listDetail__title').nth(0).child('button');
  const editor = Selector('.listDetail__title').nth(0).child('input[type="text"]');

  await t
    .click(editBtn)
    .typeText(editor, editTodoListName, {replace: true})
    .click(editBtn);

  // 編集された要素の確認
  const todoList = Selector('.listDetail__title__linkText').nth(0);
  const title = await todoList().innerText;

  assert(title.trim() === editTodoListName);
});
