const assert = require('assert');
const {Selector} = require('testcafe');

const sampleData = require('../src/sample.json')[0].todos;

fixture('check crud of detail page')
  .page('http://localhost:3001/#/detail/0');

// sample.jsonの中から、１つのTODOアイテムが表示されている
test('can see todoItem', async t => {
  const todoItemName = sampleData[0].name;
  const todoItems = Selector('.todoDetail__title__text');
  const countTodoItems = await todoItems.count;
  const titles = [];

  for (let i=0; i<countTodoItems; i++) {
    const title = await todoItems.nth(i)().innerText;
    titles.push(title.trim());
  }

  assert(titles.includes(todoItemName));
});

// TODOアイテムの新規追加と削除ができる
test('can add and remove todoItem', async t => {
  // 新規追加処理
  const newTodoItemName = '新しいアイテム';
  const input = Selector('.addTodo__input').find('input[type="text"]');
  const submit = Selector('.addTodo__submit').child('button');

  await t
    .typeText(input, newTodoItemName)
    .click(submit);

  // 追加された要素の確認
  const todoItems = Selector('.todoDetail__title__text');
  const countTodoItems = await todoItems.count;
  const titles = [];

  for (let i=0; i<countTodoItems; i++) {
    const title = await todoItems.nth(i)().innerText;
    titles.push(title.trim());
  }

  assert(titles.includes(newTodoItemName));

  // 追加された要素の削除
  const deleteBtn = Selector('.todoDetail__delete').nth(countTodoItems - 1).child('button');

  await t.click(deleteBtn);

  // 削除後の数の確認
  const countTodoItemsAfterDel = await todoItems.count;

  assert(countTodoItemsAfterDel === countTodoItems - 1);
});

// TODOアイテムの名前編集ができる
test('can edit todoList', async t => {
  // 編集処理
  const editTodoItemName = '編集アイテム';
  const editBtn = Selector('.todoDetail__title').nth(0).child('button');
  const editor = Selector('.todoDetail__title').nth(0).child('input[type="text"]');

  await t
    .click(editBtn)
    .typeText(editor, editTodoItemName, {replace: true})
    .click(editBtn);

  // 編集された要素の確認
  const todoItem = Selector('.todoDetail__title__text').nth(0);
  const title = await todoItem().innerText;

  assert(title.trim() === editTodoItemName);
});
