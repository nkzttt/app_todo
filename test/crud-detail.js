const assert = require('assert');
const {Selector} = require('testcafe');

const sampleData = require('../src/sample.json')[0].todos;

fixture('check crud of detail page')
  .page('http://localhost:3001/#/detail/0');

// sample.jsonの中から、１つのTODOアイテムが表示されている
test('can see todoItem', async t => {
  const todoItemName = sampleData[0].name;
  const todoItems = Selector('.todos').child('li');
  const todoItemsNum = await todoItems.count;
  const titles = [];

  for (let i=0; i<todoItemsNum; i++) {
    const title = await todoItems.nth(i).find('.todoDetail__title__text').innerText;
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
  const todoItems = Selector('.todos').child('li');
  const todoItemsNum = await todoItems.count;
  const titles = [];

  for (let i=0; i<todoItemsNum; i++) {
    const title = await todoItems.nth(i).find('.todoDetail__title__text').innerText;
    titles.push(title.trim());
  }

  assert(titles.includes(newTodoItemName));

  // 追加された要素の削除
  const itemDeleteBtn = Selector('.todoDetail__delete').nth(todoItemsNum - 1).child('button');
  await t.click(itemDeleteBtn);

  // 削除後の数の確認
  const todoItemsNumAfterDel = await todoItems.count;
  assert(todoItemsNumAfterDel === todoItemsNum - 1);
});

// TODOアイテムの名前編集ができる
test('can edit todoItem', async t => {
  // 編集処理
  const editTodoItemName = '編集アイテム';
  const targetItem = Selector('.todos').child('li').nth(0);
  const editBtn = targetItem.find('.todoDetail__title').child('button');
  const editor = targetItem.find('.todoDetail__title').child('input[type="text"]');

  await t
    .click(editBtn)
    .typeText(editor, editTodoItemName, {replace: true})
    .click(editBtn);

  // 編集された要素の確認
  const title = await targetItem.find('.todoDetail__title__text').innerText;
  assert(title.trim() === editTodoItemName);
});

// 新規アイテム追加時と編集時にバリデーションが行われる
test('validate addition todoItem', async t => {
  const input = Selector('.addTodo__input').find('input[type="text"]');
  const submit = Selector('.addTodo__submit').child('button');
  const todoItems = Selector('.todos').child('li');
  const initialTodoItemsNum = await todoItems.count;

  let currentTodoItemsNum = 0;

  // 未入力でsubmit
  await t
    .click(submit);

  currentTodoItemsNum = await todoItems.count;
  assert(initialTodoItemsNum === currentTodoItemsNum);

  // 31文字でsubmit
  const longStr = 'あいうえおあいうえおあいうえおあいうえおあいうえおあいうえおん';
  await t
    .typeText(input, longStr)
    .click(submit);

  currentTodoItemsNum = await todoItems.count;
  assert(initialTodoItemsNum === currentTodoItemsNum);

  // 正常値でsubmit
  const newTodoItemName = '新しいアイテム';
  await t
    .typeText(input, newTodoItemName, {replace: true})
    .click(submit);

  currentTodoItemsNum = await todoItems.count;
  assert(initialTodoItemsNum+1 === currentTodoItemsNum);

  // 同じ値でsubmit
  await t
    .typeText(input, newTodoItemName)
    .click(submit);

  currentTodoItemsNum = await todoItems.count;
  assert(initialTodoItemsNum+1 === currentTodoItemsNum);

  // 新しいアイテム2追加
  const newTodoItemName2 = '新しいアイテム2';
  await t
    .typeText(input, newTodoItemName2, {replace: true})
    .click(submit);

  currentTodoItemsNum = await todoItems.count;
  assert(initialTodoItemsNum+2 === currentTodoItemsNum);

  // 新しいアイテム2を1と同じ名前にする
  const editBtn = Selector('.todoDetail__title').nth(currentTodoItemsNum-1).child('button');
  const editor = Selector('.todoDetail__title').nth(currentTodoItemsNum-1).child('input[type="text"]');
  await t
    .click(editBtn)
    .typeText(editor, newTodoItemName, {replace: true})
    .click(editBtn);

  currentTodoItemsNum = await todoItems.count;
  assert(initialTodoItemsNum+2 === currentTodoItemsNum);
});
