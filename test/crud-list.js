const assert = require('assert');
const {Selector} = require('testcafe');

const sampleData = require('../src/sample.json');

fixture('check crud of list page')
  .page('http://localhost:3001');

// sample.jsonの中から、１つのTODOリストが表示されている
test('can see todoList', async t => {
  const todoListName = sampleData[0].name;
  const todoList = Selector('.list').child('li');
  const todoListNum = await todoList.count;
  const titles = [];

  for (let i=0; i<todoListNum; i++) {
    const title = await todoList.nth(i).find('.listDetail__title__linkText').innerText;
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
  const todoList = Selector('.list').child('li');
  const todoListNum = await todoList.count;
  const titles = [];

  for (let i=0; i<todoListNum; i++) {
    const title = await todoList.nth(i).find('.listDetail__title__linkText').innerText;
    titles.push(title.trim());
  }

  assert(titles.includes(newTodoListName));

  // 追加された要素の削除
  const itemDeleteBtn = Selector('.listDetail__delete').nth(todoListNum - 1).child('button');
  await t.click(itemDeleteBtn);

  // 削除後の数の確認
  const todoListNumAfterDel = await todoList.count;
  assert(todoListNumAfterDel === todoListNum - 1);
});

// TODOリストの名前編集ができる
test('can edit todoList', async t => {
  // 編集処理
  const editTodoListName = '編集リスト';
  const targetItem = Selector('.list').child('li').nth(0);
  const editBtn = targetItem.find('.listDetail__title').child('button');
  const editor = targetItem.find('.listDetail__title').child('input[type="text"]');

  await t
    .click(editBtn)
    .typeText(editor, editTodoListName, {replace: true})
    .click(editBtn);

  // 編集された要素の確認
  const todoList = targetItem.find('.listDetail__title__linkText');
  const title = await todoList().innerText;

  assert(title.trim() === editTodoListName);
});

// 新規リスト追加時と編集時にバリデーションが行われる
test('validate addition todoList', async t => {
  const input = Selector('.addList__input').child('input[type="text"]');
  const submit = Selector('.addList__submit').child('button');
  const todoList = Selector('.listDetail__title__linkText');
  const initialTodoListNum = await todoList.count;

  let currentTodoListNum = 0;

  // 未入力でsubmit
  await t
    .click(submit);

  currentTodoListNum = await todoList.count;
  assert(initialTodoListNum === currentTodoListNum);

  // 31文字でsubmit
  const longStr = 'あいうえおあいうえおあいうえおあいうえおあいうえおあいうえおん';
  await t
    .typeText(input, longStr)
    .click(submit);

  currentTodoListNum = await todoList.count;
  assert(initialTodoListNum === currentTodoListNum);

  // 正常値でsubmit
  const newTodoListName = '新しいリスト';
  await t
    .typeText(input, newTodoListName, {replace: true})
    .click(submit);

  currentTodoListNum = await todoList.count;
  assert(initialTodoListNum+1 === currentTodoListNum);

  // 同じ値でsubmit
  await t
    .typeText(input, newTodoListName)
    .click(submit);

  currentTodoListNum = await todoList.count;
  assert(initialTodoListNum+1 === currentTodoListNum);

  // 新しいリスト2追加
  const newTodoListName2 = '新しいリスト2';
  await t
    .typeText(input, newTodoListName2, {replace: true})
    .click(submit);

  currentTodoListNum = await todoList.count;
  assert(initialTodoListNum+2 === currentTodoListNum);

  // 新しいリスト2を1と同じ名前にする
  const editBtn = Selector('.listDetail__title').nth(currentTodoListNum-1).child('button');
  const editor = Selector('.listDetail__title').nth(currentTodoListNum-1).child('input[type="text"]');
  await t
    .click(editBtn)
    .typeText(editor, newTodoListName, {replace: true})
    .click(editBtn);

  currentTodoListNum = await todoList.count;
  assert(initialTodoListNum+2 === currentTodoListNum);
});
