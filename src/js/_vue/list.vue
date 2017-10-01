<style scoped lang="stylus">
  .red
    color: red
</style>

<template>
  <div class="pageList">
    <div class="addList">
      <div class="addList__input">
        <input type="text" placeholder="リスト名を入力してください" v-model="newName">
      </div>
      <p class="addList__submit">
        <button v-on:click="addList">リストの作成</button>
      </p>
    </div>
    <ul class="list">
      <li v-for="(item, i) in data" class="list__item" v-bind:data-index="i">
        <div class="listDetail">
          <p class="listDetail__title">
            <a href="#" class="listDetail__title__linkText">
              {{item.name}}
            </a>
            <input type="text" v-bind:value="item.name" class="listDetail__title__editText" style="display: none">
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
        // elements
        const parent = e.target.parentElement;
        const button = e.target;
        const link = parent.querySelector('a');
        const input = parent.querySelector('input[type="text"]');

        const editingClass = 'is-edit';
        const isEdit = Array.prototype.includes.call(parent.classList, editingClass);
        const index = parseInt(closestTag(parent, 'li').dataset.index, 10);

        if (isEdit) { // 編集完了

          if (!input.value) {
            return alert('値が空です。削除する場合は削除ボタンを押してください。');
          }

          this.$store
              .dispatch('editList', {
                index: index,
                name: input.value
              })
              .then(function () {
                button.innerText = '編集';
                link.style.display = 'inline-block';
                input.style.display = 'none';
              }.bind(this));

        } else {      // 編集開始

          button.innerText = '決定';
          link.style.display = 'none';
          input.style.display = 'inline-block';

        }

        parent.classList.toggle(editingClass);
      },
      deleteList (e) {
        const index = parseInt(closestTag(e.target, 'li').dataset.index, 10);
        this.$store.dispatch('deleteList', index);
      }
    },
    computed: {
      data () {
        return this.$store.state.data
      }
    }
  }

  function closestTag(current, tagName) {
    let currentTag = current;
    let currentTagName = currentTag.tagName.toLocaleLowerCase();

    while (currentTagName !== tagName) {
      currentTag = currentTag.parentElement;
      if (!currentTag) break;
      currentTagName = currentTag.tagName.toLocaleLowerCase();
    }

    return currentTag;
  }
</script>