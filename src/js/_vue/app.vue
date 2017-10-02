<style scoped lang="stylus">
  .red
    color: red
</style>

<template>
  <div class="header">
    <router-link to="/">List</router-link>
    <router-link to="/search">Search</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Hello world!'
      }
    }
  }
</script>