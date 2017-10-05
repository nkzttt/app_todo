<style scoped lang="stylus">
  @import '../../css/_variables/*'
  @import '../../css/_mixins/*'

  .fade-enter-active
  .fade-leave-active
    transition: opacity .3s
  .fade-enter
  .fade-leave-to
    opacity: 0

  .search
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

  .results
    &__item + &__item
      margin-top: 1.5rem

  .listDetail
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
    &__limit
      margin-bottom: 0.5rem
      &__value
        font-size: $size-font-secondary
        font-weight: bold
</style>

<template>
  <div class="pageSearch">
    <div class="search">
      <div class="search__input">
        <input type="text" placeholder="例）買い物" v-model="newName" v-on:keypress="submitByEnter" data-addition>
      </div>
      <p class="search__check">
        <input type="checkbox" id="ignoreDoneItem">
        <label for="ignoreDoneItem">
          完了しているTODOリスト、アイテムを検索対象外にする
        </label>
      </p>
      <p class="search__submit">
        <button class="btn btn--primary" v-on:click="search">
          <span class="fa fa-search"></span>
          検索
        </button>
      </p>
    </div>
    <p class="message" v-text="messages.list" v-if="messages.list"></p>
    <p class="errorMessage" v-text="errorMessages.list" v-if="errorMessages.list"></p>
    <ul class="results" v-if="results.list.length">
      <li v-for="item in results.list" class="results__item">
        <div class="listDetail" v-on:click="cassetteLink">
          <p class="listDetail__title">
            <router-link to="/" class="listDetail__title__linkText">
              {{item.name}}
            </router-link>
          </p>
          <p class="listDetail__created">
            <span class="listDetail__created__heading">作成日：</span>
            <span class="listDetail__created__value" v-text="transformDateString(item.timeCreated)"></span>
          </p>
        </div>
      </li>
    </ul>
    <p class="message" v-text="messages.todos" v-if="messages.todos"></p>
    <p class="errorMessage" v-text="errorMessages.todos" v-if="errorMessages.todos"></p>
    <ul class="results" v-if="results.todos.length">
      <li v-for="todo in results.todos" class="results__item" v-bind:data-index="todo.index">
        <div class="todoDetail" v-on:click="cassetteLink">
          <p class="todoDetail__title">
            <router-link v-bind:to="`/detail/${todo.index}`" class="listDetail__title__linkText" data-editTarget>
              {{todo.name}}
            </router-link>
          </p>
          <p class="todoDetail__limit">
            <span class="todoDetail__limit__heading">期　限：</span>
            <span class="todoDetail__limit__value" v-text="transformDateString(todo.timeLimit)"></span>
          </p>
          <p class="todoDetail__created">
            <span class="todoDetail__created__heading">作成日：</span>
            <span class="todoDetail__created__value" v-text="transformDateString(todo.timeCreated)"></span>
          </p>
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

  export default {
    data () {
      return {
        messages: {
          list: null,
          todos: null
        },
        errorMessages: {
          list: null,
          todos: null
        },
        results: {
          list: [],
          todos: []
        }
      }
    },

    methods: {
      cassetteLink (e) {
        e.currentTarget.querySelector('a').click();
      },

      search (e) {},

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