<style scoped lang="stylus">
  @import '../../css/_variables/*'
  @import '../../css/_mixins/*'

  .slideCalendar-enter-active
  .slideCalendar-leave-active
    max-height: 300px
    overflow: hidden
    transition: max-height .3s ease-out
  .slideCalendar-enter
  .slideCalendar-leave-to
    max-height: 0

  .fade-enter-active
  .fade-leave-active
    transition: opacity .3s
  .fade-enter
  .fade-leave-to
    opacity: 0

  .pageDetail
    position: relative

  .listName
    position: absolute
    top: 5px
    right: 0
    color: $color-disable

  .addTodo
    width: 50%
    margin-bottom 6rem
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
      align-items: top
      width: 100%
      margin-bottom 1rem
      &__text
        width: 5.25em
        white-space: nowrap
    &__submit
      padding-left: 5.25em

  .message
  .errorMessage
    margin-bottom 1.5rem
    padding: 5px 1rem 6px
    border-radius: 3px
    border: solid 1px $color-main
    color: $color-main
  .errorMessage
    margin -4.5rem 0 6rem
    border-color: $color-sub
    color: $color-sub

  .todos
    &__item + &__item
      margin-top: 1.5rem

  .todoDetail
    position: relative
    padding: 1.5rem
    padding-right: 6.5rem
    border-radius: 3px
    background-color: #fff
    box-shadow: 1px 1px 3px $color-shadow
    overflow: hidden
    cursor: pointer
    transition all 200ms ease-out
    &:hover
      transform translateY(-5px)
      box-shadow: 5px 5px 10px $color-shadow
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
      &__editBtn
        white-space: nowrap
      &__editText
        display: inline-block
        margin-right 1rem
    &__limit
      margin-bottom: 0.5rem
      &__value
        font-size: $size-font-secondary
        font-weight: bold
    &__limit
    &__created
      padding-left: 3rem
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

  .is-highlight > .todoDetail
    box-shadow 0 0 .75rem $color-main

  @media (max-width: 414px)
    .listName
      position: static
      margin: -2.25rem 0 3rem
      font-size: $size-font-small
      text-align: right

    .addTodo
      width: 100%
      &__input
        margin-bottom .75rem
      &__submit__button
        margin-left: auto

    .todoDetail
      &__title__editText
        flex: 1
      &__created
       margin-bottom: 1.5rem
      &__status
        width: 100%
        position: static
</style>

<template>
  <div class="pageDetail">
    <p class="listName">【{{listName}}】</p>
    <div class="addTodo">
      <div class="addTodo__input">
        <label for="addTodo" class="addTodo__input__label">ＴＯＤＯ：</label>
        <input type="text" placeholder="例）シャンプー買う" class="addTodo__input__area" id="addTodo" v-model="newName" v-on:keypress="submitByEnter" data-addition>
      </div>
      <transition name="slideCalendar">
        <div class="addTodo__choose" v-if="newName">
          <p class="addTodo__choose__text">
            期　　限：
          </p>
          <div class="addTodo__choose__calendar">
            <date-picker
                v-model="choseDate"
                v-bind:inline="DPOptions.inline"
                v-bind:disabled="DPOptions.disabled"
                language="ja"
            ></date-picker>
          </div>
        </div>
      </transition>
      <p class="addTodo__submit">
        <button v-on:click="addTodo" class="addTodo__submit__button btn btn--primary">アイテムを追加</button>
      </p>
    </div>
    <p class="errorMessage" v-if="!todos.length">
      登録されているアイテムがありません。アイテムを追加してください。
    </p>
    <transition name="fade">
      <p class="errorMessage" v-text="errorMessage" v-if="errorMessage"></p>
    </transition>
    <transition name="fade">
      <p class="message" v-text="message" v-if="message"></p>
    </transition>
    <ul class="todos" v-if="todos.length">
      <li v-for="(todo, i) in todos" class="todos__item" v-bind:data-index="i">
        <div class="todoDetail" v-bind:class="{'todoDetail--done': todo.isDone}" v-on:click="toggleStatus">
          <p class="todoDetail__title">
            <span class="todoDetail__title__text" data-editTarget="">
              {{todo.name}}
            </span>
            <input type="text" v-bind:value="todo.name" class="todoDetail__title__editText" data-editor="" style="display: none" v-on:keypress="submitByEnter" v-on:click.stop>
            <button class="todoDetail__title__editBtn btn btn--small btn--secondary" v-on:click.stop="editTodo">編集</button>
          </p>
          <p class="todoDetail__limit">
            <span class="todoDetail__limit__heading">期　限：</span>
            <span class="todoDetail__limit__value" v-text="transformDateString(todo.timeLimit)"></span>
          </p>
          <p class="todoDetail__created">
            <span class="todoDetail__created__heading">作成日：</span>
            <span class="todoDetail__created__value" v-text="transformDateString(todo.timeCreated)"></span>
          </p>
          <p class="todoDetail__status todoDetail__status--done" v-if="todo.isDone">完了</p>
          <p class="todoDetail__status" v-if="!todo.isDone">未完了</p>
          <div class="todoDetail__delete">
            <button class="todoDetail__delete__btn" v-on:click.stop="deleteTodo">
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
      displayMessage,
      searchClosestTag,
      editName,
      submitByEnter,
      validateNewName,
      createDateString,
      transformDateString,
      handleError
  } from '../_util/methods';

  import jump from 'jump.js';

  import datePicker from 'vuejs-datepicker';
  const DPOptions = {
    inline: true,
    disabled: {
      to: (function() {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d;
      })(),
      from: (function() {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        d.setDate(d.getDate() - 1);
        return d;
      })()
    }
  };

  export default {
    data () {
      const listIndex = parseInt(this.$route.params.index, 10);

      return {
        message: null,
        errorMessage: null,
        newName: '',
        listIndex,
        listName: this.$store.state.data[listIndex].name,
        todos: this.$store.state.data[listIndex].todos,
        choseDate: new Date(),
        DPOptions
      }
    },

    components: {
      'date-picker': datePicker
    },

    methods: {
      toggleStatus(e) {
        const index = parseInt(searchClosestTag(e.target, 'li').dataset.index, 10);
        this.$store
            .dispatch('toggleTodoStatus', {
              listIndex: this.listIndex,
              index: index
            })
      },

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
                todoName: this.newName,
                createdDate: createDateString(new Date),
                limitDate: createDateString(this.choseDate)
              })
              .then(function () {
                displayMessage(this, '新しいアイテムが作成されました。');

                this.newName = '';
                this.choseDate = new Date();
              }.bind(this));

        }.bind(this)).catch(handleError);
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
        }.bind(this)).catch(handleError);
      },

      deleteTodo (e) {
        const index = parseInt(searchClosestTag(e.target, 'li').dataset.index, 10);
        this.$store.dispatch('deleteTodo', {
          listIndex: this.listIndex,
          index
        }).then(function () {
          displayMessage(this, 'アイテムが正常に削除されました。');
        }.bind(this));
      },

      transformDateString,
      submitByEnter
    },

    mounted () {
      const todoIndex = this.$route.query.index;
      if (!todoIndex) return;

      const searchedTarget = this.$el.querySelector(`.todos > [data-index="${todoIndex}"]`);

      // ページ遷移アニメーション分待機
      setTimeout(function () {

        // scrollTo
        jump(searchedTarget);

        // highlight
        searchedTarget.classList.add('is-highlight');
        setTimeout(function () {
          searchedTarget.classList.remove('is-highlight');
        }, 3000);

      }, 300);
    }
  }
</script>