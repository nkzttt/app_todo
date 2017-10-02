const validator = require('validator');

module.exports = ({data, newName}) => {

  if (validator.isEmpty(newName)) {
    return '1文字以上入力してください。';
  }

  if (validator.isLength(newName, 31)) {
    return '30文字以内で入力してください。';
  }

  const existNames = data.map(({name}) => name);
  if (validator.isIn(newName, existNames)) {
    return '同じ名前のリストが存在します。別の名前を入力してください。';
  }

  return null;

};
