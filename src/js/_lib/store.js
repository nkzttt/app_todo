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
    },
    addTodo ({data}, todoData) {
      data[0].todos.push(todoData);
    },
    editTodo ({data}, editData) {
      data[0].todos[editData.index].name = editData.name;
    },
    deleteTodo ({data}, index) {
      data[0].todos.splice(index, 1)
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
    },
    addTodo ({commit}, todoName) {
      const todoData = createNewTodo(todoName);
      commit('addTodo', todoData);
    },
    editTodo ({commit}, editData) {
      commit('editTodo', editData);
    },
    deleteTodo ({commit}, index) {
      commit('deleteTodo', index);
    }
  }
}

function createNewList(name) {
  return {
    name,
    todos: []
  }
}

function createNewTodo(name) {
  return {
    name,
    timeCreated: "2000-09-21",
    timeLimit: "2000-09-30",
    isDone: false
  }
}
