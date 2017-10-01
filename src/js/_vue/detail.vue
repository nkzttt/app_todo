<style scoped lang="stylus">
  .red
    color: red
</style>

<template>
  <div class="pageDetail">
    <div class="addTodo">
      <div class="addTodo__input">
        <label>
          TODO：
          <input type="text" placeholder="例）シャンプー買う" v-model="newName">
        </label>
      </div>
      <div class="addTodo__choose">
        期限：
        <label>
          <input type="radio" name="limit" value="1">あした
        </label>
        <label>
          <input type="radio" name="limit" value="2">あさって
        </label>
        <label>
          <input type="radio" name="limit" value="7">１週間
        </label>
        <label>
          <input type="radio" name="limit" value="0">指定する
        </label>
      </div>
      <p class="addTodo__submit">
        <button v-on:click="addTodo">TODOの追加</button>
      </p>
    </div>
    <ul class="todos">
      <li v-for="(todo, i) in todos" class="todos__item" v-bind:data-index="i">
        <div class="todoDetail">
          <p class="todoDetail__title">
            <p class="todoDetail__title__text" data-editTarget="">
              {{todo.name}}
            </p>
            <input type="text" v-bind:value="todo.name" class="todoDetail__title__editText" data-editor="" style="display: none">
            <button class="todoDetail__title__editBtn" v-on:click="editTodo">編集</button>
          </p>
          <div class="todoDetail__delete">
            <button class="todoDetail__delete__btn" v-on:click="deleteTodo">削除</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {searchClosestTag, editName} from '../_util/methods';

  export default {
    data () {
      return {
        newName: '',
        listIndex: parseInt(this.$route.params.index, 10)
      }
    },
    methods: {
      addTodo (e) {
        this.$store
            .dispatch('addTodo', {
              listIndex: this.listIndex,
              todoName: this.newName
            })
            .then(function () {
              this.newName = '';
            }.bind(this));
      },
      editTodo (e) {
        editName.call(this, e.target, 'editTodo', this.listIndex);
      },
      deleteTodo (e) {
        const index = parseInt(searchClosestTag(e.target, 'li').dataset.index, 10);
        this.$store.dispatch('deleteTodo', {
          listIndex: this.listIndex,
          index
        });
      }
    },
    computed: {
      todos () {
        const todos = this.$store.state.data[this.listIndex].todos;
        return (todos && todos.length) ? todos : [];
      }
    }
  }
</script>