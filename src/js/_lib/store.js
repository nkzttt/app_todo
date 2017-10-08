import Data from '../../sample.json';

export default {
  state: {
    data: Data
  },
  mutations: {
    addList ({data}, listData) {
      data.unshift(listData);
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
    addList ({commit}, newData) {
      const listData = createNewList(newData);
      commit('addList', listData);
    },
    editList ({commit}, editData) {
      commit('editList', editData);
    },
    deleteList ({commit}, index) {
      commit('deleteList', index);
    },
    addTodo ({commit}, newData) {
      const todoData = createNewTodo(newData);
      commit('addTodo', {
        listIndex: newData.listIndex,
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

function createNewList({listName, createdDate}) {
  return {
    name: listName,
    todos: [],
    timeCreated: createdDate,
  }
}

function createNewTodo({todoName, createdDate, limitDate}) {
  return {
    name: todoName,
    timeCreated: createdDate,
    timeLimit: limitDate,
    isDone: false
  }
}
