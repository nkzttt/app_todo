<style scoped lang="stylus">
  @import '../../css/_variables/*'
  @import '../../css/_mixins/*'

  .message-enter-active
  .message-leave-active
    transition: opacity .3s
  .message-enter
  .message-leave-to
    opacity: 0

  .errorMessage
    color: $color-sub

  .addTodo
    width: 50%
    margin-bottom 3rem
    &__input
      display: flex
      align-items: center
      width: 100%
      margin-bottom 1rem
      &__label
        width: 5.25em
      &__area
        flex: 1
    &__choose
      display: flex
      align-items: center
      width: 100%
      margin-bottom 1rem
      &__text
        width: 5.25em
      &__list
        flex: 1
    &__submit
      padding-left: 5.25em

  .radioSet
    display: flex
    width: 100%
    &__input
      display none
    &__label
      flex: 1
      padding: 3px 5px 4px
      border: solid 1px $color-main
      color: $color-main
      text-align: center
      cursor: pointer
      transition: background-color 200ms ease-out
      &:hover
        background-color: rgba(50, 153, 187, 0.1)
      &:not(:first-of-type)
        border-left: none
      &:first-of-type
        border-radius: 3px 0 0 3px
      &:last-of-type
        border-radius: 0 3px 3px 0
    &__input:checked + &__label
      background-color: $color-main
      color: #fff

  .message
  .errorMessage
    margin -1.5rem 0 3rem
    padding: 5px 1rem 6px
    border-radius: 3px
    border: solid 1px $color-main
    color: $color-main
  .errorMessage
    border-color: $color-sub
    color: $color-sub

  .todos
    &__item + &__item
      margin-top: 1.5rem

  .todoDetail
    position: relative
    padding: 1.5rem
    padding-right: 5rem
    border-radius: 3px
    background-color: #fff
    box-shadow: 1px 1px 3px $color-shadow
    overflow: hidden
    &--done
      background-color: $color-disable
      color: $color-background
    &__title
      display: flex
      align-items: center
      margin-bottom: 1.5rem
      &__text
        display: inline-block
        margin-right 1.5rem
        font-size: $size-font-primary
        font-weight: bold
        text-decoration: none
      &__editText
        display: inline-block
        margin-right 1rem
    &__limit
      margin-bottom: 0.5rem
      &__value
        font-size: $size-font-secondary
        font-weight: bold
    &__status
      display: flex
      align-items: center
      justify-content: center
      width: 200px
      height: ($size-font-normal + $size-font-secondary + 0.5rem)
      position: absolute
      bottom: 1.5rem
      right 6.5rem
      border: solid 1px $color-sub
      font-size: $size-font-secondary
      font-weight: bold
      &--done
        border-color: $color-background
        color: $color-background
    &__delete
      width: 5rem
      position: absolute
      top: 0
      bottom: 0
      right: 0
      background-color: $color-sub
      hoverOpacityAnimation()
      &__btn
        width: 100%
        height: 100%
        color: #fff
        font-size: $size-font-primary
        font-weight: bold
        cursor: pointer
</style>

<template>
  <div class="pageDetail">
    <div class="addTodo">
      <div class="addTodo__input">
        <label for="addTodo" class="addTodo__input__label">ＴＯＤＯ：</label>
        <input type="text" placeholder="例）シャンプー買う" class="addTodo__input__area" id="addTodo" v-model="newName" v-on:keypress="submitByEnter" data-addition>
      </div>
      <div class="addTodo__choose">
        <p class="addTodo__choose__text">
          期　　限：
        </p>
        <div class="addTodo__choose__list">
          <div class="radioSet">
            <input type="radio" name="limit" value="1" class="radioSet__input" id="limit1" checked>
            <label for="limit1" class="radioSet__label">あした</label>
            <input type="radio" name="limit" value="2" class="radioSet__input" id="limit2">
            <label for="limit2" class="radioSet__label">あさって</label>
            <input type="radio" name="limit" value="7" class="radioSet__input" id="limit3">
            <label for="limit3" class="radioSet__label">１週間</label>
            <input type="radio" name="limit" value="0" class="radioSet__input" id="limit4">
            <label for="limit4" class="radioSet__label">指定する</label>
          </div>
        </div>
      </div>
      <p class="addTodo__submit">
        <button v-on:click="addTodo" class="btn btn--primary">TODOの追加</button>
      </p>
    </div>
    <transition name="message">
      <p class="message" v-text="message" v-if="message"></p>
    </transition>
    <transition name="message">
      <p class="errorMessage" v-text="errorMessage" v-if="errorMessage"></p>
    </transition>
    <ul class="todos">
      <li v-for="(todo, i) in todos" class="todos__item" v-bind:data-index="i">
        <div class="todoDetail" v-bind:class="{'todoDetail--done': todo.isDone}">
          <p class="todoDetail__title">
            <span class="todoDetail__title__text" data-editTarget="">
              {{todo.name}}
            </span>
            <input type="text" v-bind:value="todo.name" class="todoDetail__title__editText" data-editor="" style="display: none" v-on:keypress="submitByEnter">
            <button class="todoDetail__title__editBtn btn btn--small btn--secondary" v-on:click="editTodo">編集</button>
          </p>
          <p class="todoDetail__limit">
            <span class="todoDetail__limit__heading">期　限：</span>
            <span class="todoDetail__limit__value" v-text="todo.timeLimit"></span>
          </p>
          <p class="todoDetail__created">
            <span class="todoDetail__created__heading">作成日：</span>
            <span class="todoDetail__created__value" v-text="todo.timeCreated"></span>
          </p>
          <p class="todoDetail__status todoDetail__status--done" v-if="todo.isDone">完了</p>
          <p class="todoDetail__status" v-if="!todo.isDone">未完了</p>
          <div class="todoDetail__delete">
            <button class="todoDetail__delete__btn" v-on:click="deleteTodo">
              <span class="fa fa-trash-o"></span>
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {
      searchClosestTag,
      editName,
      submitByEnter,
      createData,
      validateNewName
  } from '../_util/methods';

  export default {
    data () {
      const listIndex = parseInt(this.$route.params.index, 10);

      return {
        message: null,
        errorMessage: null,
        newName: '',
        listIndex,
        todos: this.$store.state.data[listIndex].todos
      }
    },

    methods: {
      addTodo (e) {
        // validate
        validateNewName({
          type: 'item',
          data: this.todos,
          newName: this.newName
        }).then(function (errorMessage) {

          // エラーメッセージが帰って来たらエラーメッセージを表示して終了
          if (errorMessage) {
            displayMessage(this, errorMessage, 'errorMessage');
            this.$el.querySelector('[data-addition]').focus();
            return;
          }

          this.$store
              .dispatch('addTodo', {
                listIndex: this.listIndex,
                todoName: this.newName
              })
              .then(function () {
                this.newName = '';
              }.bind(this));

          displayMessage(this, '新しいアイテムが作成されました。');

        }.bind(this)).catch(console.error);
      },

      editTodo (e) {
        editName({
          type: 'item',
          vm: this,
          eventTarget: e.target,
          dispatchName: 'editTodo',
          listIndex: this.listIndex
        }).then(function (res) {
          if (!res) return;

          displayMessage(this, res.errorMessage, 'errorMessage');
          res.input.focus();
        }.bind(this)).catch(console.error);
      },

      deleteTodo (e) {
        const index = parseInt(searchClosestTag(e.target, 'li').dataset.index, 10);
        this.$store.dispatch('deleteTodo', {
          listIndex: this.listIndex,
          index
        });
      },

      submitByEnter
    }
  }

  /**
   * メッセージ表示と一定時間で非表示
   * @param vm {Object} - vueインスタンス
   * @param message {String}
   */
  function displayMessage(vm, message, target='message') {
    vm[target] = message;
    setTimeout(function () {
      vm[target] = null;
    }, 3000);
  }
</script>