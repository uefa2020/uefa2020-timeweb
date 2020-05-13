<template>
  <div class="d-flex flex-column fill-height" :style="{width: '100vw'}">
    <div
      class="flex-grow-0"
      v-if="gamblers.length > 1"
      :style="{borderBottom: '1px black solid'}"
    >
      <h3 class="ml-5 my-1">Сейчас в чате</h3>
      <v-chip
        v-for="(gambler, i) in gamblers"
        :key="gambler.id"
        v-if="gambler.id !== currentGambler.id"
        class="ml-3 mb-2"
        dark
        :color="gambler.sex === 'м' ? 'blue lighten-2' : 'pink lighten-2'"
      >
        {{gambler.nickname}}
      </v-chip>
    </div>

    <div class="flex-grow-1 mx-auto mt-2 mb-5 elevation-15" :style="{maxWidth: '85vw'}">
      <div class="flex-grow-0 grey" :style="{height: '10vh'}">
      </div>

      <div class="d-flex flex-column" :style="{maxHeight: '65vh', overflowY: 'auto'}">
        <ul class="mt-2">
          <li v-for="message in messages" :key="message.id">
            {{$moment(message.date).format('DD.MM.YYYY HH:mm:ss')}} {{message.from}}: {{message.message}}
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!--<div :style="{width: '100%', height: '100%'}">
    <div
      class="flex-grow-0"
      v-if="gamblers.length > 1"
      :style="{borderBottom: '1px black solid'}"
    >
      <h3 class="ml-5 my-1">Сейчас в чате</h3>
      <v-chip
        v-for="(gambler, i) in gamblers"
        :key="gambler.id"
        v-if="gambler.id !== currentGambler.id"
        class="ml-3 mb-2"
        dark
        :color="gambler.sex === 'м' ? 'blue lighten-2' : 'pink lighten-2'"
      >
        {{gambler.nickname}}
      </v-chip>
    </div>

    <div class="flex-grow-1 d-flex flex-column">
      <div class="flex-grow-1">
        <ul class="mt-2">
          <li v-for="message in messages" :key="message.id">
            {{$moment(message.date).format('DD.MM.YYYY HH:mm:ss')}} {{message.from}}: {{message.message}}
          </li>
        </ul>
      </div>

      <div class="flex-grow-0 secondary" :style="{height: '100px'}">
      </div>
    </div>
  </div>-->
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'chat',
    async asyncData({store}) {
      await store.dispatch('chat/loadGamblers');
      await store.dispatch('chat/loadMessages')
    },
    /*mounted() {
      this.$socket.emit('chat', this.getGambler);
    },*/
    computed: {
      ...mapGetters({
        getGamblers: 'chat/getGamblers',
        getMessages: 'chat/getMessages',
        getGambler: 'gambler/getGambler'
      }),
      currentGambler() {
        return this.getGambler
      },
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
