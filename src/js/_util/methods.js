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
 * @param eventTarget {Element}
 * @param dispatchName {String}
 */
function editName(eventTarget, dispatchName) {
  // elements
  const parent = eventTarget.parentElement;
  const button = eventTarget;
  const link = parent.querySelector('[data-editTarget]');
  const input = parent.querySelector('[data-editor]');

  const editingClass = 'is-edit';
  const isEdit = Array.prototype.includes.call(parent.classList, editingClass);
  const index = parseInt(searchClosestTag(parent, 'li').dataset.index, 10);

  if (isEdit) { // 編集完了

    if (!input.value) {
      return alert('値が空です。削除する場合は削除ボタンを押してください。');
    }

    this.$store
      .dispatch(dispatchName, {
        index: index,
        name: input.value
      })
      .then(function () {
        button.innerText = '編集';
        link.style.display = 'inline-block';
        input.style.display = 'none';
      }.bind(this));

  } else {      // 編集開始

    button.innerText = '決定';
    link.style.display = 'none';
    input.style.display = 'inline-block';

  }

  parent.classList.toggle(editingClass);
}

// methods export
export {
  searchClosestTag,
  editName
}