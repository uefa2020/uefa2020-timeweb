<template>
  <div>
    <ul>
      <li v-for="message in messages" :key="message.id">
        {{message.message}}
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'chat',
    async asyncData({store}) {
      await store.dispatch('message/loadMessages')
    },
    computed: {
      ...mapGetters({
        getMessages: 'message/getMessages'
      }),
      messages() {
        return this.getMessages
      }
    }
  }
</script>

<style scoped>

</style>
