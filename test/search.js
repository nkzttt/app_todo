const assert = require('assert');
const {Selector} = require('testcafe');

fixture('check crud of list page')
  .page('http://localhost:3001/#/search');

// 検索ができる
test('can search', async t => {
  const searchStr = 'やること';
  const input = Selector('.search__input').child('input[type="text"]');
  const ignoreBtn = Selector('.search__check').child('label');
  const submit = Selector('.search__submit').child('button');
  const results = Selector('.results');

  let hitTodosNum = 0;
  let hitListNum = 0;

  // 全件検索
  await t
    .typeText(input, searchStr)
    .click(submit);

  hitTodosNum = await results.nth(0).child('li').count;
  hitListNum = await results.nth(1).child('li').count;

  assert(hitTodosNum === 3 && hitListNum === 1);

  // Done除外検索
  await t
    .click(ignoreBtn)
    .click(submit);

  hitTodosNum = await results.nth(0).child('li').count;
  hitListNum = await results.nth(1).child('li').count;

  assert(hitTodosNum === 2 && hitListNum === 1);

  // 全てをdoneにしてから再検索
  const toTopBtn = Selector('.siteLogo');
  const toSearchBtn = Selector('.rootSearch');
  const listLink = Selector('.list').child('li');
  const todoItem = Selector('.todos').child('li');

  await t
    .click(toTopBtn)
    .wait(500)
    .click(listLink.nth(0))
    .wait(500)
    .click(todoItem.nth(0))
    .click(todoItem.nth(1))
    .click(toSearchBtn)
    .wait(500)
    .typeText(input, searchStr)
    .click(ignoreBtn)
    .click(submit);

  const resultsNum = await results.count;

  assert(resultsNum === 0);
});
