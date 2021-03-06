<style scoped lang="stylus">
  @import '../../css/_variables/*'
  @import '../../css/_mixins/*'

  .fade-enter-active
  .fade-leave-active
    transition: opacity .3s
  .fade-enter
  .fade-leave-to
    opacity: 0

  .addList
    display: flex
    width: 50%
    margin-bottom 6rem
    align-items: center
    &__input
      flex: 1
      padding-right 1rem
      > input
        width: 100%

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

  .list
    &__item + &__item
      margin-top: 1.5rem

  .listDetail
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
      &__linkText
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
    &__number
      margin-bottom: 0.5rem
      &__total
      &__done
        font-size: $size-font-secondary
        font-weight: bold
    &__number
    &__nearestLimit
      padding-left: 3rem
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

  .is-highlight > .listDetail
    box-shadow 0 0 .75rem $color-main

  @media (max-width: 414px)
    .addList
      display: block
      width: 100%
      &__input
        margin-bottom: .75rem
        padding-right 0
      &__submit__button
        margin-left: auto
    .listDetail__title__editText
      flex: 1
</style>

<template>
  <div class="pageList">
    <div class="addList">
      <div class="addList__input">
        <input type="text" placeholder="例）買い物リスト" v-model="newName" v-on:keypress="submitByEnter" data-addition>
      </div>
      <p class="addList__submit">
        <button class="addList__submit__button btn btn--primary" v-on:click="addList">リストを追加</button>
      </p>
    </div>
    <p class="errorMessage" v-if="!customData.length">
      登録されているリストがありません。リストを追加してください。
    </p>
    <transition name="fade">
      <p class="errorMessage" v-text="errorMessage" v-if="errorMessage"></p>
    </transition>
    <transition name="fade">
      <p class="message" v-text="message" v-if="message"></p>
    </transition>
    <ul class="list" v-if="customData.length">
      <li v-for="item in customData" class="list__item" v-bind:data-index="item.index">
        <div class="listDetail" v-bind:class="{'listDetail--done': item.todos.total && item.todos.total === item.todos.done}" v-on:click="cassetteLink">
          <p class="listDetail__title">
            <router-link v-bind:to="`/detail/${item.index}`" class="listDetail__title__linkText" data-editTarget>
              {{item.name}}
            </router-link>
            <input type="text" v-bind:value="item.name" class="listDetail__title__editText" data-editor style="display: none" v-on:keypress="submitByEnter" v-on:click.stop>
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
            〜{{transformDateString(item.nearestLimit)}}
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
      displayMessage,
      searchClosestTag,
      editName,
      submitByEnter,
      createData,
      createDateString,
      transformDateString,
      validateNewName,
      handleError
  } from '../_util/methods';

  import jump from 'jump.js';

  export default {
    data () {
      return {
        message: null,
        errorMessage: null,
        newName: '',
        data: this.$store.state.data,
        customData: []
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
              .dispatch('addList', {
                listName: this.newName,
                createdDate: createDateString(new Date),
              })
              .then(function () {
                displayMessage(this, '新しいリストが作成されました。');

                this.newName = '';
              }.bind(this));

        }.bind(this)).catch(handleError);
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
        }.bind(this)).catch(handleError);
      },

      deleteList (e) {
        const index = parseInt(searchClosestTag(e.target, 'li').dataset.index, 10);
        this.$store.dispatch('deleteList', index).then(function () {
          displayMessage(this, 'リストが正常に削除されました。');
        }.bind(this));
      },

      transformDateString,
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
          }.bind(this)).catch(handleError);
        },
        deep: true
      }
    },

    mounted () {
      // サーバーでデータ加工
      createData({
        type: 'list',
        data: this.data
      }).then(function (customData) {
        this.customData = customData;

        this.$nextTick(function () { // レンダー完了待機

          // 検索結果ハイライト
          const targetIndex = this.$route.query.index;
          if (!targetIndex) return;

          const searchedTarget = this.$el.querySelector(`.list > [data-index="${targetIndex}"]`);

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

        });
      }.bind(this)).catch(handleError);
    }
  }
</script>