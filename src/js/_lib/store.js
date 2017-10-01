import Data from '../../sample.json';

export default {
  state: {
    data: Data
  },
  mutations: {
    addList ({data}, listData) {
      data.push(listData);
    },
    editList ({data}, editData) {
      data[editData.index].name = editData.name;
    },
    deleteList ({data}, index) {
      data.splice(index, 1)
    }
  },
  actions: {
    addList ({commit}, listName) {
      const listData = createNewList(listName);
      commit('addList', listData);
    },
    editList ({commit}, editData) {
      commit('editList', editData);
    },
    deleteList ({commit}, index) {
      commit('deleteList', index);
    }
  }
}

function createNewList(name) {
  return {
    name,
    todos: []
  }
}
