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
    margin-bottom 3rem

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
        <label>
          TODO：
          <input type="text" placeholder="例）シャンプー買う" v-model="newName" v-on:keypress="submitByEnter" data-addition>
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
        <div class="todoDetail">
          <p class="todoDetail__title">
            <span class="todoDetail__title__text" data-editTarget="">
              {{todo.name}}
            </span>
            <input type="text" v-bind:value="todo.name" class="todoDetail__title__editText" data-editor="" style="display: none" v-on:keypress="submitByEnter">
            <button class="todoDetail__title__editBtn btn btn--small btn--secondary" v-on:click="editTodo">編集</button>
          </p>
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
  import {searchClosestTag, editName} from '../_util/methods';
  import {post} from 'superagent';

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
        validateItemName(this.todos, this.newName).then(function (errorMessage) {

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
        editName.call(this, e.target, 'editTodo', this.listIndex);
      },
      deleteTodo (e) {
        const index = parseInt(searchClosestTag(e.target, 'li').dataset.index, 10);
        this.$store.dispatch('deleteTodo', {
          listIndex: this.listIndex,
          index
        });
      },
      submitByEnter (e) {
        if (e.which !== 13) return;

        // 一番近いsubmitボタンを探す
        let parent = e.target.parentElement;
        let submitBtn = parent.querySelector('button');

        while (!submitBtn) {
          if (!parent) return;

          submitBtn = parent.querySelector('button');
          parent = parent.parentElement;
        }

        // フォーカスを外してsubmit
        e.target.blur();
        submitBtn.click();
      }
    }
  }

  /**
   * サーバーで新規TODOアイテムのバリデーションを行う
   * @param data {Object}
   * @param newName {String}
   * @returns {Promise}
   */
  function validateItemName(data, newName) {
    return new Promise(function (resolve, reject) {
      post('/api/validate/item')
          .send({
            data,
            newName
          })
          .end(function (err, res) {
            if (err) return reject(err);

            const errorMessage = res.text;
            if (errorMessage) {
              resolve(errorMessage);
            } else {
              resolve(null);
            }
          });
    });
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