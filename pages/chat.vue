<template>
  <div class="d-flex flex-column" :style="{width: '100%', height: heightMessages, border: '1px solid red'}">
    <div class="d-flex flex-row py-1 pr-1" :style="{borderBottom: '2px solid grey'}">
      <v-col class="pa-1" cols="6">
        <h3 class="ml-5">Сейчас в чате</h3>
        <v-chip
          v-for="(gambler, i) in gamblers"
          :key="gambler.id"
          v-if="gambler.id !== currentGambler.id"
          class="ml-1 mt-1"
          dark
          :color="gambler.sex === 'м' ? 'blue lighten-2' : 'pink lighten-2'"
        >
          {{gambler.nickname}}
        </v-chip>
      </v-col>
      <v-col cols="6" class="pa-1 d-flex flex-column">
        <v-textarea
          label="Текст сообщения"
          hide-details
          outlined
          :rows="rows"
          prepend-inner-icon="fas fa-comment-dots"
        />

        <v-btn class="mt-2 ml-auto" color="primary">
          Отправить
          <v-icon right>far fa-share-square</v-icon>
        </v-btn>
      </v-col>
    </div>

    <!--<div class="d-flex flex-row mx-auto" :style="{height: '100%', width: widthMessages, overflowY: 'auto'}">-->
    <v-card
      :width="widthMessages"
      height="100%"
      color="purple lighten-4"
      class="mt-2 mx-auto"
      :style="{overflowY: 'auto'}"
    >
      <v-list
        three-line
        v-for="message in messages"
        :key="message.id"
        width="70%"
        color="purple lighten-4"
        class="py-0 mx-auto"
        :style="{border: '1px solid red'}"
      >
        <v-list-item
          class="px-1"
          :style="{minHeight: '50px'}"
        >
          <v-list-item-avatar width="35%" class="my-1 mr-1 justify-end">
            <v-icon :style="{width: '50px'}" v-if="message.from === 'администратор'">fas fa-user</v-icon>
            <v-img v-else src="/photo/1-1588407917954.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-content class="py-1">
            <v-list-item-subtitle>
              {{$moment(message.date).format('DD.MM.YYYY HH:mm:ss')}}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-html="message.from"></v-list-item-subtitle>
            <v-list-item-title v-html="message.message"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!--<ul class="mt-2">
        <li v-for="message in messages" :key="message.id">
          {{$moment(message.date).format('DD.MM.YYYY HH:mm:ss')}} {{message.from}}: {{message.message}}
        </li>
      </ul>-->
    </v-card>
    <!--</div>-->
  </div>
</template>
<!--<div class="d-flex flex-column fill-height" :style="{width: '100vw'}">
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
</div>-->

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
      },
      rows() {
        let rows = 1;
        switch (this.$vuetify.breakpoint.name) {
          case 'xl':
          case 'lg':
            rows = 2;
            break;
          case 'md':
            rows = 3;
            break;
          case 'sm':
            rows = 4;
            break;
          default:
            rows = 5
        }

        return rows
      },
      widthMessages() {
        let width = '';
        switch (this.$vuetify.breakpoint.name) {
          case 'xl':
          case 'lg':
            width = '70%';
            break;
          case 'md':
            width = '85%';
            break;
          default:
            width = '100%'
        }

        return width
      },
      heightMessages() {
        let height = '88vh';
        /*switch (this.$vuetify.breakpoint.name) {
          case 'xl':
          case 'lg':
            height = '88vh';
            break;
          case 'md':
            height = '85vh';
            break;
          case 'sm':
            height = '65vh';
            break;
          default:
            height = '35vh'
        }*/

        return height
      }
    }
  }
</script>

<style scoped>

</style>
