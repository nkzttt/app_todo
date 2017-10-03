<style scoped lang="stylus">
  @import '../../css/_variables/*'
  @import '../../css/_mixins/*'
</style>

<template>
  <div class="container">
    <div class="header">
      <div class="header__insideContainer">
        <div class="rootSiteLink">
          <div class="rootSiteLink__logo">
            <router-link to="/" class="siteLogo">
              <span class="siteLogo__icon fa fa-check-circle-o"></span>
              TODOリスト
            </router-link>
          </div>
          <div class="rootSiteLink__search">
            <router-link to="/search" class="rootSearch">
              <span class="rootSearch__icon fa fa-search"></span>
              検索
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main__insideContainer">
        <router-view></router-view>
      </div>
    </div>
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