<style scoped lang="stylus">
  @import '../../css/_variables/*'
  @import '../../css/_mixins/*'

  .contentsFade-enter-active
  .contentsFade-leave-active
    transition: opacity .15s linear, transform .15s ease-in
  .contentsFade-enter
  .contentsFade-leave-to
    opacity: 0
    transform: translateY(10px)
  .contentsFade-enter-active
    transition-delay: .3s
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
        <transition name="contentsFade">
          <router-view></router-view>
        </transition>
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