<style scoped lang="stylus">
  .red
    color: red
</style>

<template>
  <div class="pageList">
    <div class="addList">
      <div class="addList__input">
        <input type="text" placeholder="リスト名を入力してください">
      </div>
      <p class="addList__submit">
        <button>リストの作成</button>
      </p>
    </div>
    <ul class="list">
      <li v-for="item in data" class="list__item">
        <div class="listDetail">
          <p class="listDetail__title">
            <a href="#" class="listDetail__title__linkText">
              {{item.name}}
            </a>
            <button class="listDetail__title__editBtn">編集</button>
          </p>
          <div class="listDetail__delete">
            <button class="listDetail__delete__btn">削除</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    methods: {},
    computed: {
      data () {
        return this.$store.state.data
      }
    }
  }
</script>