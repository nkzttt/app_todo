<style scoped lang="stylus">
  .red
    color: red
</style>

<template>
  <div class="pageList">
    <div class="addList">
      <div class="addList__input">
        <input type="text" placeholder="例）買い物リスト" v-model="newName">
      </div>
      <p class="addList__submit">
        <button v-on:click="addList">リストの作成</button>
      </p>
    </div>
    <ul class="list">
      <li v-for="(item, i) in data" class="list__item" v-bind:data-index="i">
        <div class="listDetail">
          <p class="listDetail__title">
            <a href="#" class="listDetail__title__linkText" data-editTarget>
              {{item.name}}
            </a>
            <input type="text" v-bind:value="item.name" class="listDetail__title__editText" data-editor style="display: none">
            <button class="listDetail__title__editBtn" v-on:click="editList">編集</button>
          </p>
          <div class="listDetail__delete">
            <button class="listDetail__delete__btn" v-on:click="deleteList">削除</button>
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
        newName: ''
      }
    },
    methods: {
      addList (e) {
        this.$store
            .dispatch('addList', this.newName)
            .then(function () {
              this.newName = '';
            }.bind(this));
      },
      editList (e) {
        editName.call(this, e.target, 'editList');
      },
      deleteList (e) {
        const index = parseInt(searchClosestTag(e.target, 'li').dataset.index, 10);
        this.$store.dispatch('deleteList', index);
      }
    },
    computed: {
      data () {
        return this.$store.state.data
      }
    }
  }
</script>