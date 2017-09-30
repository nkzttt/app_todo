<style scoped lang="stylus">
  .red
    color: red
</style>

<template>
  <h1 class="red">{{msg}}</h1>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Search'
      }
    }
  }
</script>