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
 * - 空メッセージが表示されている
 * - TODOアイテムが追加できる
 * - TODOアイテムを追加した際に親リストが先頭にくる
 * - 空メッセージが消えている
 * - ソート後のリストでも詳細画面に遷移できる
 * - TODOアイテムのステータスを変更でき、非活性ビジュアルになる
 * - 全てのTODOアイテムがdoneになった場合に親リストが非活性ビジュアルになる
 * - 別リストのTODOアイテムとリンクしていない
 */
test('check addition flow', async t => {
  // リスト画面用変数
  const listItems = Selector('.list').child('li');
  const newListName = '新しいリスト';
  const addListInput = Selector('.addList__input').child('input[type="text"]');
  const addListSubmit = Selector('.addList__submit').child('button');

  // todo画面用変数
  const todoItems = Selector('.todos').child('li');
  const newTodoItemName = '新しいアイテム';
  const addItemInput = Selector('.addTodo__input').find('input[type="text"]');
  const addItemSubmit = Selector('.addTodo__submit').child('button');

  // 共通変数
  const topLink = Selector('.siteLogo');
  const errorMessage = Selector('.errorMessage');
  let currentErrorMessage = null;
  let currentErrorMessageNum = 0;

  // 新規TODOアイテムの追加
  const initialLinkNum = await listItems.count;

  await t
    .typeText(addListInput, newListName)
    .click(addListSubmit);

  // リスト追加後の数確認
  let currentLinkNum = await listItems.count;
  assert(currentLinkNum === initialLinkNum + 1);

  // 新規リストの詳細画面へ遷移
  await t
    .click(listItems.nth(currentLinkNum - 1))
    .wait(500);

  // 空メッセージの確認
  const emptyMessage = '登録されているアイテムがありません。アイテムを追加してください。';
  currentErrorMessage = await errorMessage().innerText;

  assert(currentErrorMessage.trim() === emptyMessage);

  // アイテムがないことの確認
  const initialItemsNum = await todoItems.count;
  assert(initialItemsNum === 0);

  // 新規TODOアイテムの追加
  await t
    .typeText(addItemInput, newTodoItemName)
    .click(addItemSubmit);

  // リスト追加後の数確認
  let currentItemsNum = await todoItems.count;
  assert(currentItemsNum === initialItemsNum + 1);

  // 空メッセージが消えているか確認
  currentErrorMessageNum = await errorMessage().count;
  assert(currentErrorMessageNum === 0);

  // リスト画面へ戻り、親リストが先頭になっていることの確認
  await t
    .click(topLink)
    .wait(500);

  const textDisplayedAtTop = await listItems.nth(0).find('.listDetail__title__linkText').innerText;
  assert(textDisplayedAtTop.trim() === newListName);

  // 再度新規リスト詳細画面へ遷移し新規TODOアイテムを確認する
  await t
    .click(listItems.nth(0))
    .wait(500);

  const newTodoItem = await todoItems.nth(0).find('.todoDetail__title__text').innerText;
  assert(newTodoItem.trim() === newTodoItemName);

  // アイテムのステータスを変更し、doneクラスを確認する
  await t
    .click(todoItems.nth(0));

  const hasTodoDoneClass = await todoItems.nth(0).child('div').hasClass('todoDetail--done');
  assert(hasTodoDoneClass);

  // リスト画面へ戻り、親リストのdoneクラスを確認する
  await t
    .click(topLink)
    .wait(500);

  const hasListDoneClass = await listItems.nth(0).child('div').hasClass('listDetail--done');
  assert(hasListDoneClass);

  // 別リストの詳細画面へ遷移
  await t
    .click(listItems.nth(1))
    .wait(500);

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
