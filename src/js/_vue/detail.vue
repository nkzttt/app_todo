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

  .errorMessage
    color: $color-sub

  .pageDetail
    position: relative

  .listName
    position: absolute
    top: 5px
    right: 0
    color: $color-disable

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
      align-items: top
      width: 100%
      margin-bottom 1rem
      &__text
        width: 5.25em
    &__submit
      padding-left: 5.25em

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
        <button v-on:click="addTodo" class="btn btn--primary">アイテムを追加</button>
      </p>
    </div>
    <transition name="fade">
      <p class="message" v-text="message" v-if="message"></p>
    </transition>
    <transition name="fade">
      <p class="errorMessage" v-text="errorMessage" v-if="errorMessage"></p>
    </transition>
    <p class="errorMessage" v-if="!todos.length">
      登録されているアイテムがありません。アイテムを追加してください。
    </p>
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
      searchClosestTag,
      editName,
      submitByEnter,
      createData,
      validateNewName,
      handleError
  } from '../_util/methods';

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
                createDate: createDateString(new Date),
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
        });
      },

      transformDateString,
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

  /**
   * DateオブジェクトからYYYYMMDD形式の文字列を作成して返す
   * @param Date {Date}
   * @returns {String}
   */
  function createDateString(Date) {
    let year = Date.getFullYear() + '';
    let month = Date.getMonth() + 1 + '';
    month = month.length === 2 ? month : '0' + month;
    let date = Date.getDate() + '';
    date = date.length === 2 ? date : '0' + date;

    return year + month + date;
  }

  /**
   * YYYYMMDD形式の文字列をYYYY年MM月DD日形式にして返す
   * @param dateString
   * @returns {*}
   */
  function transformDateString(dateString) {
    const year = dateString.substr(0,4);
    const month = dateString.substr(4,2);
    const date = dateString.substr(-2);
    return `${year}年${month}月${date}日`;
  }
</script>