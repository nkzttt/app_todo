<style scoped lang="stylus">
  .red
    color: red
</style>

<template>
  <div class="pageList">
    <ul class="list">
      <li v-for="item in data">
        {{item.name}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    computed: {
      data () {
        return this.$store.state.data
      }
    }
  }
</script>