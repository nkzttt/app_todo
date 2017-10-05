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
    display: flex
    width: 50%
    position: relative
    margin-bottom 6rem
    padding-bottom: ($size-font-small + 1rem)
    align-items: center
    &__input
      flex: 1
      padding-right 1rem
      > input
        width: 100%
    &__check
      position: absolute
      bottom: 0
      left: 0
      font-size: $size-font-small
      > input
        display: none
        + label
          color: $color-disable
          transition: color .1s linear
          > .checked
            display: none
        &:checked + label
          color: $color-font
          > .disabled
            display: none
          > .checked
            display: inline-block
            color: $color-main

  .checkLabel
    display: inline-block
    position: relative
    padding-left: 2rem
    &__icon
      display: inline-block
      position: absolute
      top: -0.2rem
      left: 0
      font-size: $size-font-normal

  .message
  .errorMessage
    margin-bottom 1.5rem
    padding: 5px 1rem 6px
    border-radius: 3px
    border: solid 1px $color-main
    color: $color-main
  .errorMessage
    border-color: $color-sub
    color: $color-sub

  .message
    &__hits
      display: inline-block
      font-weight: bold
      letter-spacing: 0.25em
      text-indent: @letter-spacing

  .results
    margin-bottom: 6rem
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
        <label for="ignoreDoneItem" class="checkLabel">
          <span class="fa fa-square-o disabled checkLabel__icon"></span>
          <span class="fa fa-check-square-o checked checkLabel__icon"></span>
          完了しているTODOリスト・アイテムを検索対象外にする
        </label>
      </p>
      <p class="search__submit">
        <button class="btn btn--primary" v-on:click="search">
          <span class="fa fa-search"></span>
          検索
        </button>
      </p>
    </div>
    <p class="message" v-if="hits.todos">
      アイテムが
      <span class="message__hits">{{hits.todos}}件</span>
      見つかりました
    </p>
    <p class="errorMessage" v-text="errorMessages.todos" v-if="errorMessages.todos"></p>
    <ul class="results" v-if="results.todos.length">
      <li v-for="todo in results.todos" class="results__item">
        <div class="todoDetail" v-on:click="cassetteLink">
          <p class="todoDetail__title">
            <router-link v-bind:to="`/detail/${todo.listIndex}`" class="listDetail__title__linkText" data-editTarget>
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
    <p class="message" v-if="hits.list">
      アイテムが
      <span class="message__hits">{{hits.list}}件</span>
      見つかりました
    </p>
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
  </div>
</template>

<script>
  import {
      displayMessage,
      submitByEnter,
      transformDateString,
      handleError
  } from '../_util/methods';

  export default {
    data () {
      return {
        hits: {
          list: 1,
          todos: 2
//          list: null,
//          todos: null
        },
        errorMessages: {
          list: null,
          todos: null
        },
        results: {
          list: [
            {
              name: 'やることリスト',
              timeCreated: '20000901'
            }
          ],
          todos: [
            {
              listIndex: 0,
              name: 'やること１',
              "timeCreated": "20000921",
              "timeLimit": "20000930"
            },
            {
              listIndex: 0,
              name: 'やること２',
              "timeCreated": "20000921",
              "timeLimit": "20000930"
            }
          ]
//          list: [],
//          todos: []
        }
      }
    },

    methods: {
      cassetteLink (e) {
        e.currentTarget.querySelector('a').click();
      },

      search (e) {},

      transformDateString,
      submitByEnter
    }
  }
</script>