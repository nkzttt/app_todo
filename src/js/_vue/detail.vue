<style scoped lang="stylus">
  .red
    color: red
</style>

<template>
  <div class="pageList">
    <ul class="list">
      <li v-for="todo in todos">
        {{todo.name}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    computed: {
      todos () {
        const todos = this.$store.state.data[0].todos;
        return (todos && todos.length) ? todos : [];
      }
    }
  }
</script>