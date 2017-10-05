import {post} from 'superagent';

/**
 * 最も近くの要素をタグで検索
 * @param current {Element}
 * @param tagName {String}
 * @returns {Element}
 */
function searchClosestTag(current, tagName) {
  let currentTag = current;
  let currentTagName = currentTag.tagName.toLocaleLowerCase();

  while (currentTagName !== tagName) {
    currentTag = currentTag.parentElement;
    if (!currentTag) break;
    currentTagName = currentTag.tagName.toLocaleLowerCase();
  }

  return currentTag;
}

/**
 * edit name of
 * @param type {String}
 * @param vm {Object}
 * @param eventTarget {Element}
 * @param dispatchName {String}
 * @param listIndex {Number}
 */
function editName({type, vm, eventTarget, dispatchName, listIndex}) {
  // elements
  const parent = eventTarget.parentElement;
  const button = eventTarget;
  const link = parent.querySelector('[data-editTarget]');
  const input = parent.querySelector('[data-editor]');

  const editingClass = 'is-edit';
  const isEdit = Array.prototype.includes.call(parent.classList, editingClass);
  const index = parseInt(searchClosestTag(parent, 'li').dataset.index, 10);

  return new Promise(function (resolve, reject) {
    if (isEdit) { // 編集完了

      // 値に変更がなければ表示を戻して終了
      const beforeValue = input.previousElementSibling.innerText.trim();
      if (beforeValue === input.value) {
        resetDisplay();
        return resolve(null);
      }

      // validate
      validateNewName({
        type,
        data: vm.data || vm.todos,
        newName: input.value
      }).then(function (errorMessage) {
        if (errorMessage) return resolve({errorMessage, input});

        vm.$store
          .dispatch(dispatchName, {
            index,
            listIndex,
            name: input.value
          })
          .then(resetDisplay);
      }).catch(reject);

    } else {      // 編集開始

      button.innerText = '決定';
      link.style.display = 'none';
      input.style.display = 'inline-block';
      parent.classList.add(editingClass);
      input.focus();

      resolve(null);

    }
  });

  function resetDisplay() {
    button.innerText = '編集';
    link.style.display = 'inline-block';
    input.style.display = 'none';
    parent.classList.remove(editingClass);
  }
}

/**
 * 入力エリアでエンターキーが入力された際に一番近くのsubmitボタンでsubmitする
 * @param e {Object} - event object
 */
function submitByEnter(e) {
  if (e.which !== 13) return;

  // 一番近いsubmitボタンを探す
  let parent = e.target.parentElement;
  let submitBtn = parent.querySelector('button');

  while (!submitBtn) {
    if (!parent) return;

    submitBtn = parent.querySelector('button');
    parent = parent.parentElement;
  }

  // フォーカスを外してsubmit
  e.target.blur();
  submitBtn.click();
}

/**
 * サーバーでデータを整形する
 * @param type {String}
 * @param data {Object}
 * @returns {Promise}
 */
function createData({type, data}) {
  return new Promise(function (resolve, reject) {
    post(`/api/create-data/${type}`)
      .send(data)
      .end(function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
  });
}

/**
 * サーバーでバリデーションを行う
 * @param type {String}
 * @param data {Object}
 * @param newName {String}
 * @returns {Promise}
 */
function validateNewName({type, data, newName}) {
  return new Promise(function (resolve, reject) {
    post(`/api/validate/${type}`)
      .send({
        data,
        newName
      })
      .end(function (err, res) {
        if (err) return reject(err);

        const errorMessage = res.text;
        if (errorMessage) {
          resolve(errorMessage);
        } else {
          resolve(null);
        }
      });
  });
}

function handleError(err) {
  console.error(err);
  alert('サーバーエラーが発生しました。通信環境をお確かめください。通信環境に問題がない場合は、お手数ですがサーバー管理者にご連絡ください。');
}

// methods export
export {
  searchClosestTag,
  editName,
  submitByEnter,
  createData,
  validateNewName,
  handleError
}