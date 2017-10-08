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
    margin -4.5rem 0 6rem
    padding: 5px 1rem 6px
    border-radius: 3px
    border: solid 1px $color-main
    color: $color-main
    &--result
      margin 0 0 1.5rem
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
    &__listName
    &__limit
    &__created
      padding-left: 3rem
  .todoDetail
    &__listName
      margin-bottom: 1.5rem

  @media (max-width: 414px)
    .search
      display: block
      width: 100%
      padding-bottom: 0
      &__input
        margin-bottom: .75rem
        padding-right 0
      &__check
        width: 70%
        margin-bottom: -0.1em
        line-height: 1.2
      &__submit__button
        margin-left: auto
    .checkLabel__icon
      top: 0
</style>

<template>
  <div class="pageSearch">
    <div class="search">
      <div class="search__input">
        <input type="text" placeholder="例）買い物" v-model="searchStr" v-on:keypress="submitByEnter" data-search>
      </div>
      <p class="search__check">
        <input type="checkbox" id="ignoreDoneItem" data-ignore>
        <label for="ignoreDoneItem" class="checkLabel">
          <span class="fa fa-square-o disabled checkLabel__icon"></span>
          <span class="fa fa-check-square-o checked checkLabel__icon"></span>
          完了しているTODOリスト・アイテムを検索対象外にする
        </label>
      </p>
      <p class="search__submit">
        <button class="search__submit__button btn btn--primary" v-on:click="search">
          <span class="fa fa-search"></span>
          検索
        </button>
      </p>
    </div>
    <transition name="fade">
      <p class="errorMessage" v-text="errorMessage" v-if="errorMessage"></p>
    </transition>
    <p class="message message--result" v-if="hits && hits.todos">
      アイテムが
      <span class="message__hits">{{hits.todos}}件</span>
      見つかりました。
    </p>
    <p class="errorMessage errorMessage--result" v-if="hits && !hits.todos">
      アイテムが見つかりませんでした。
    </p>
    <ul class="results" v-if="results && results.todos.length">
      <li v-for="todo in results.todos" class="results__item">
        <div class="todoDetail" v-on:click="cassetteLink">
          <p class="todoDetail__title">
            <router-link v-bind:to="`/detail/${todo.listIndex}?index=${todo.index}`" class="listDetail__title__linkText">
              {{todo.name}}
            </router-link>
          </p>
          <p class="todoDetail__listName">
            リスト：{{todo.listName}}
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
    <p class="message message--result" v-if="hits && hits.list">
      リストが
      <span class="message__hits">{{hits.list}}件</span>
      見つかりました。
    </p>
    <p class="errorMessage errorMessage--result" v-if="hits && !hits.list">
      リストが見つかりませんでした。
    </p>
    <ul class="results" v-if="results && results.list.length">
      <li v-for="item in results.list" class="results__item">
        <div class="listDetail" v-on:click="cassetteLink">
          <p class="listDetail__title">
            <router-link v-bind:to="`/?index=${item.index}`" class="listDetail__title__linkText">
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

  import {post} from 'superagent';

  export default {
    data () {
      return {
        searchStr: '',
        errorMessage: null,
        results: null
      }
    },

    computed: {
      hits() {
        if (!this.results) return null;

        return {
          list: this.results.list.length,
          todos: this.results.todos.length
        }
      }
    },

    methods: {
      cassetteLink (e) {
        e.currentTarget.querySelector('a').click();
      },

      search (e) {
        const err = simpleValidate(this.searchStr);
        if (err) {
          displayMessage(this, err, 'errorMessage');
          this.$el.querySelector('[data-search]').focus();
          return;
        }

        post(`/api/search`)
            .send({
              data: this.$store.state.data,
              searchStr: this.searchStr,
              ignoreDoneItem: this.$el.querySelector('[data-ignore]').checked
            })
            .end(function (err, {body}) {
              if (err) {
                handleError(err);
              } else {
                this.results = body;
              }
            }.bind(this));
      },

      transformDateString,
      submitByEnter
    }
  }

  /**
   *
   * @param str
   * @returns {String | null} - return String if have get error.
   */
  function simpleValidate(str) {
    if (str.length < 2) {
      return '検索文字数は２文字以上にしてください。'
    }

    return null;
  }
</script>