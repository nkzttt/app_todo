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

  .toolFade-enter-active
  .toolFade-leave-active
    transition: opacity .15s linear, transform .15s ease-out
  .toolFade-enter
  .toolFade-leave-to
    opacity: 0
    transform: translateY(10px)
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
          <div class="rootSiteLink__toolLinks">
            <div class="help">
              <a href="#" v-on:click.prevent="isSeenHelp = true" class="help__button">
                <span class="help__button__icon fa fa-question"></span>
                ヘルプ
              </a>
              <transition name="toolFade">
                <div class="help__content" v-if="isSeenHelp">
                  <p class="help__content__text">
                    このアプリは<em>ブラウザを保存領域に使用</em>します。<br>
                    他の端末、他のブラウザで表示した際にはデータは引き継がれませんのでご注意ください。<br>
                  </p>
                  <p class="help__content__reset">
                    <a href="#" class="help__content__reset__link" v-on:click.prevent="reset">
                      <span class="fa fa-trash"></span>
                      データリセット
                    </a>
                  </p>
                  <p class="help__content__hide">
                    <a href="#" class="help__content__hide__link" v-on:click.prevent="isSeenHelp = false">
                      <span class="fa fa-window-close"></span>
                      ヘルプを閉じる
                    </a>
                  </p>
                </div>
              </transition>
            </div>
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
        isSeenHelp: false
      }
    },

    methods: {
      reset (e) {
        this.$store.dispatch('resetApp').then(function () {
          location.href = '/#/';
          location.reload();
        }.bind(this));
      }
    }
  }
</script>