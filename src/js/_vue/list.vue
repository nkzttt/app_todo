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

  .addList
    display: table
    width: 50%
    margin-bottom 3rem
    align-items: center
    &__input
    &__submit
      display: table-cell
    &__input
      width: 100%
      padding-right 1rem
      > input
        width: 100%
    &__submit
      white-space nowrap

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

  .list
    &__item + &__item
      margin-top: 1.5rem

  .listDetail
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
    &__title
      display: flex
      align-items: center
      margin-bottom: 1.5rem
      &__linkText
        display: inline-block
        margin-right 1.5rem
        font-size: $size-font-primary
        font-weight: bold
        text-decoration: none
      &__editText
        display: inline-block
        margin-right 1rem
    &__number
      margin-bottom: 0.5rem
      &__total
      &__done
        font-size: $size-font-secondary
        font-weight: bold
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
  <div class="pageList">
    <div class="addList">
      <div class="addList__input">
        <input type="text" placeholder="例）買い物リスト" v-model="newName" v-on:keypress="submitByEnter" data-addition>
      </div>
      <p class="addList__submit">
        <button class="btn btn--primary" v-on:click="addList">リストの作成</button>
      </p>
    </div>
    <transition name="message">
      <p class="message" v-text="message" v-if="message"></p>
    </transition>
    <transition name="message">
      <p class="errorMessage" v-text="errorMessage" v-if="errorMessage"></p>
    </transition>
    <ul class="list">
      <li v-for="item in customData" class="list__item" v-bind:data-index="item.index">
        <div class="listDetail" v-on:click="cassetteLink">
          <p class="listDetail__title">
            <router-link v-bind:to="`/detail/${item.index}`" class="listDetail__title__linkText" data-editTarget>
              {{item.name}}
            </router-link>
            <input type="text" v-bind:value="item.name" class="listDetail__title__editText" data-editor style="display: none" v-on:keypress="submitByEnter">
            <button class="listDetail__title__editBtn btn btn--small btn--secondary" v-on:click.stop="editList">編集</button>
          </p>
          <p class="listDetail__number" v-if="item.todos.total">
            <span class="listDetail__number__total">
              {{item.todos.total}}
            </span>
            個中
            <span class="listDetail__number__done">
              {{item.todos.done}}
            </span>
            個がチェック済み
          </p>
          <p class="listDetail__nearestLimit" v-if="item.nearestLimit">
            〜{{item.nearestLimit}}
          </p>
          <div class="listDetail__delete">
            <button class="listDetail__delete__btn" v-on:click.stop="deleteList">
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
      return {
        message: null,
        errorMessage: null,
        newName: '',
        data: this.$store.state.data,
        customData: null
      }
    },

    methods: {
      cassetteLink (e) {
        e.currentTarget.querySelector('a').click();
      },

      addList (e) {
        // validate
        validateNewName({
          type: 'list',
          data: this.data,
          newName: this.newName
        }).then(function (errorMessage) {

          // エラーメッセージが帰って来たらエラーメッセージを表示して終了
          if (errorMessage) {
            displayMessage(this, errorMessage, 'errorMessage');
            this.$el.querySelector('[data-addition]').focus();
            return;
          }

          this.$store
              .dispatch('addList', this.newName)
              .then(function () {
                this.newName = '';
              }.bind(this));

          displayMessage(this, '新しいリストが作成されました。');

        }.bind(this)).catch(console.error);
      },

      editList (e) {
        editName({
          type: 'list',
          vm: this,
          eventTarget: e.target,
          dispatchName: 'editList'
        }).then(function (res) {
          if (!res) return;

          displayMessage(this, res.errorMessage, 'errorMessage');
          res.input.focus();
        }.bind(this)).catch(console.error);
      },

      deleteList (e) {
        const index = parseInt(searchClosestTag(e.target, 'li').dataset.index, 10);
        this.$store.dispatch('deleteList', index).then(function () {
          displayMessage(this, 'リストが正常に削除されました。');
        }.bind(this));
      },

      submitByEnter
    },

    watch: {
      data: {
        handler (newData, oldData) {
          createData({
            type: 'list',
            data: newData
          }).then(function (customData) {
            this.customData = customData;
          }.bind(this)).catch(console.error);
        },
        deep: true
      }
    },

    mounted () {
      createData({
        type: 'list',
        data: this.data
      }).then(function (customData) {
        this.customData = customData;
      }.bind(this)).catch(console.error);
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