<template>
  <div>
    <ul class="d-flex">
      <li class="mr-3" v-for="(gambler, i) in gamblers" :key="gambler.id">
        {{gambler.nickname}}{{i < gamblers.length - 1 ? ',' : ''}}
      </li>
    </ul>
    <ul>
      <li v-for="message in messages" :key="message.id">
        {{$moment(message.date).format('DD.MM.YYYY HH:mm:ss')}} {{message.from}}: {{message.message}}
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'chat',
    async asyncData({store}) {
      await store.dispatch('chat/loadMessages')
    },
    computed: {
      ...mapGetters({
        getGamblers: 'chat/getGamblers',
        getMessages: 'chat/getMessages'
      }),
      gamblers() {
        return this.getGamblers
      },
      messages() {
        return this.getMessages
      }
    }
  }
</script>

<style scoped>

</style>
