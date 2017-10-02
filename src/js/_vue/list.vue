<style scoped lang="stylus">
  .message-enter-active
  .message-leave-active
    transition: opacity .3s
  .message-enter
  .message-leave-to
    opacity: 0

  .errorMessage
    color: red
</style>

<template>
  <div class="pageList">
    <div class="addList">
      <div class="addList__input">
        <input type="text" placeholder="例）買い物リスト" v-model="newName" data-addition>
      </div>
      <p class="addList__submit">
        <button v-on:click="addList">リストの作成</button>
      </p>
    </div>
    <transition name="message">
      <p class="message" v-text="message" v-if="message"></p>
      <p class="errorMessage" v-text="errorMessage" v-if="errorMessage"></p>
    </transition>
    <ul class="list">
      <li v-for="item in customData" class="list__item" v-bind:data-index="item.index">
        <div class="listDetail">
          <p class="listDetail__title">
            <router-link v-bind:to="`/detail/${item.index}`" class="listDetail__title__linkText" data-editTarget>
              {{item.name}}
            </router-link>
            <input type="text" v-bind:value="item.name" class="listDetail__title__editText" data-editor style="display: none">
            <button class="listDetail__title__editBtn" v-on:click="editList">編集</button>
          </p>
          <p class="listDetail__number" v-if="item.todos.total">
            <span class="listDetail__number__total">
              {{item.todos.total}}
            </span>
            個中
            <span class="listDetail__number__done">
              {{item.todos.done}}
            </span>
            個がチェック済み
          </p>
          <p class="listDetail__nearestLimit" v-if="item.nearestLimit">
            〜{{item.nearestLimit}}
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
  import {post} from 'superagent';

  export default {
    data () {
      return {
        message: null,
        errorMessage: null,
        newName: '',
        data: this.$store.state.data,
        customData: null
      }
    },
    methods: {
      addList (e) {
        // validate
        validateListName(this.data, this.newName).then(function (errorMessage) {

          // エラーメッセージが帰って来たらエラーメッセージを表示して終了
          if (errorMessage) {
            displayMessage(this, errorMessage, 'errorMessage');
            this.$el.querySelector('[data-addition]').focus();
            return;
          }

          this.$store
              .dispatch('addList', this.newName)
              .then(function () {
                this.newName = '';
              }.bind(this));

          displayMessage(this, '新しいリストが作成されました。');

        }.bind(this)).catch(console.error);

      },
      editList (e) {
        editName.call(this, e.target, 'editList');
      },
      deleteList (e) {
        const index = parseInt(searchClosestTag(e.target, 'li').dataset.index, 10);
        this.$store.dispatch('deleteList', index).then(function () {
          displayMessage(this, 'リストが正常に削除されました。');
        }.bind(this));
      }
    },
    watch: {
      data: {
        handler (newData, oldData) {
          createData(newData).then(function (customData) {
            this.customData = customData;
          }.bind(this)).catch(console.error);
        },
        deep: true
      }
    },
    mounted () {
      createData(this.data).then(function (customData) {
        this.customData = customData;
      }.bind(this)).catch(console.error);
    }
  }

  /**
   * サーバーでリスト画面用にデータを整形する
   * @param data {Object}
   * @returns {Promise}
   */
  function createData(data) {
    return new Promise(function (resolve, reject) {
      post('/api/create-data/list')
          .send(data)
          .end(function (err, res) {
            if (err) {
              reject(err);
            } else {
              resolve(res.body);
            }
          });
    });
  }

  /**
   * サーバーで新規リストのバリデーションを行う
   * @param data {Object}
   * @param newName {String}
   * @returns {Promise}
   */
  function validateListName(data, newName) {
    return new Promise(function (resolve, reject) {
      post('/api/validate/list')
          .send({
            data,
            newName
          })
          .end(function (err, res) {
            if (err) return reject(err);

            const errorMessage = res.text;
            if (errorMessage) {
              resolve(errorMessage);
            } else {
              resolve(null);
            }
          });
    });
  }

  /**
   * メッセージ表示と一定時間で非表示
   * @param vm {Object} - vueインスタンス
   * @param message {String}
   */
  function displayMessage(vm, message, target='message') {
    vm[target] = message;
    setTimeout(function () {
      vm[target] = null;
    }, 3000);
  }
</script>