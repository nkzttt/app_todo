const assert = require('assert');
const {Selector} = require('testcafe');

fixture('system check')
  .page('http://localhost:3001');

/*
 * 追加系の一連の操作を確認する
 *
 * チェック項目
 * - リストが追加できる
 * - 新規リストの詳細に遷移でき、TODOアイテムが空である
 * - TODOアイテムが追加できる
 * - 別リストのTODOアイテムとリンクしていない
 */
test('check addition flow', async t => {
  const list = Selector('.list');
  const listLink = list.find('a');
  const initialLinkNum = await listLink.count;

  // リストの追加
  const newListName = '新しいリスト';
  const addListInput = Selector('.addList__input').child('input[type="text"]');
  const addListSubmit = Selector('.addList__submit').child('button');

  await t
    .typeText(addListInput, newListName)
    .click(addListSubmit);

  // リスト追加後の数確認
  const currentLinkNum = await listLink.count;

  assert(currentLinkNum === initialLinkNum + 1);

  // 新規リストの詳細画面へ遷移
  const newListLink = listLink.nth(currentLinkNum - 1);

  await t.click(newListLink);

  // アイテムがないことの確認
  const todoItems = Selector('.todos').child('li');
  const initialItemsNum = await todoItems.count;

  assert(initialItemsNum === 0);

  // TODOアイテムの追加
  const newTodoItemName = '新しいアイテム';
  const addItemInput = Selector('.addTodo__input').find('input[type="text"]');
  const addItemSubmit = Selector('.addTodo__submit').child('button');

  await t
    .typeText(addItemInput, newTodoItemName)
    .click(addItemSubmit);

  // リスト追加後の数確認
  const currentItemsNum = await todoItems.count;

  assert(currentItemsNum === initialItemsNum + 1);

  // 別リストの詳細画面へ遷移
  const topLink = Selector('.siteLogo');

  await t
    .click(topLink)
    .click(listLink.nth(0));

  // 上で追加したアイテムが存在しないことの確認
  const otherTodoItemTitles = Selector('.todoDetail__title__text');
  const titlesNum = await otherTodoItemTitles.count;
  const titles = [];

  for (let i=0; i<titlesNum; i++) {
    const title = await otherTodoItemTitles.nth(i)().innerText;
    titles.push(title.trim());
  }

  assert(!titles.includes(newTodoItemName));
});
