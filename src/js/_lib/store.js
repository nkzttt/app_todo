import Data from '../../sample.json';

export default {
  state: {
    data: Data
  },
  mutations: {
    addList ({data}, listData) {
      data.push(listData);
    },
    editList ({data}, {index, name}) {
      data[index].name = name;
    },
    deleteList ({data}, index) {
      data.splice(index, 1)
    },
    addTodo ({data}, {listIndex, todoData}) {
      data[listIndex].todos.unshift(todoData);
    },
    editTodo ({data}, {index, listIndex, name}) {
      data[listIndex].todos[index].name = name;
    },
    deleteTodo ({data}, {listIndex, index}) {
      data[listIndex].todos.splice(index, 1)
    },
    toggleTodoStatus ({data}, {listIndex, index}) {
      const target = data[listIndex].todos[index];
      const isDone = target.isDone;
      target.isDone = !isDone;
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
    addTodo ({commit}, {listIndex, todoName}) {
      const todoData = createNewTodo(todoName);
      commit('addTodo', {
        listIndex,
        todoData
      });
    },
    editTodo ({commit}, editData) {
      commit('editTodo', editData);
    },
    deleteTodo ({commit}, deleteData) {
      commit('deleteTodo', deleteData);
    },
    toggleTodoStatus ({commit}, indexData) {
      commit('toggleTodoStatus', indexData);
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
    timeCreated: "20010921",
    timeLimit: "20010930",
    isDone: false
  }
}
