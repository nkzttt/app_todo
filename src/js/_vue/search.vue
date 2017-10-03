<style scoped lang="stylus">
  @import '../../css/_variables/*'
  @import '../../css/_mixins/*'
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