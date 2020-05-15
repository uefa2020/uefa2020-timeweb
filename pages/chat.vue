<template>
  <div class="d-flex flex-column" :style="{width: '100%', height: heightMessages}">
    <div class="d-flex flex-row mb-3 py-1 pr-1" :style="{borderBottom: '2px solid grey'}">
      <v-col class="pa-1" cols="6">
        <h3 class="ml-5">
          {{gamblers.length > 1 ? 'Сейчас в чате:' : 'Сейчас в чате никого нет'}}
        </h3>
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
          v-model="text"
          label="Текст сообщения"
          hide-details
          outlined
          :rows="rows"
          prepend-inner-icon="fas fa-comment-dots"
        />

        <v-btn small class="mt-2 ml-auto" color="primary" @click="sendMessage()">
          Отправить
          <v-icon right>far fa-share-square</v-icon>
        </v-btn>
      </v-col>
    </div>

    <div ref="chat" :style="{height: '100%', overflowY: 'auto'}">
      <v-card
        flat
        :width="widthMessages"
        color="purple lighten-4"
        class="my-1 mx-auto py-2"
      >
        <v-list
          v-for="(message, i) in messages"
          :key="message.id"
          :width="message.layout.list.width"
          color="purple lighten-4"
          class="px-2 py-0"
          :class="message.layout.list.class"
        >
          <v-list-item
            class="px-1"
            :style="{minHeight: '25px', borderBottom: '1px solid grey'}"
          >
            <v-list-item-avatar
              v-if="message.fromId == 0"
              width="25%"
              class="my-1 mr-1 justify-end"
            >
              <v-icon :style="{width: '50px'}">fas fa-user</v-icon>
            </v-list-item-avatar>

            <v-list-item-avatar v-else class="ma-2" :class="message.layout.avatar.class">
              <v-img width="20" :src="`/photo/${message.photo}`"></v-img>
            </v-list-item-avatar>

            <v-list-item-content
              class="py-1"
              :class="message.layout.content.class"
            >
              <v-list-item-subtitle :style="{whiteSpace: 'normal !important'}">
                {{$moment(message.date).format('DD.MM.YYYY HH:mm:ss')}}
              </v-list-item-subtitle>

              <v-list-item-subtitle>
                {{message.fromNick}}
              </v-list-item-subtitle>

              <v-list-item-title v-html="message.message" @click="editMessage(message)"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'chat',
    async asyncData({store}) {
      await store.dispatch('chat/loadGamblers');
      await store.dispatch('chat/loadMessages')
    },
    data() {
      return {
        message: null,
        text: ''
      }
    },
    mounted() {
      setTimeout(() => {
        this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
      })
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
        switch (this.$vuetify.breakpoint.name) {
          case 'xl':
          case 'lg':
            height = '88vh';
            break;
          case 'md':
            height = '85vh';
            break;
          case 'sm':
            height = '82vh';
            break;
          default:
            height = '80vh'
        }

        return height
      }
    },
    watch: {
      messages() {
        setTimeout(() => {
          this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
        })
      }
    },
    methods: {
      editMessage(message) {
        this.message = message;
        this.text = message.message.replace(/<br\/>/g, '\n')
      },
      async sendMessage() {
        if (this.message) {
          this.message.message = this.text.replace(/([^>])\n/g, '$1<br/>')

          await this.$socket.emit('editMessage', message);

          this.message = null
        } else {
          const message = {
            fromId: this.getGambler.id,
            fromNick: this.getGambler.nickname,
            photo: this.getGambler.photo,
            to: 'uefa2020',
            message: this.text.replace(/([^>])\n/g, '$1<br/>')
          };

          await this.$socket.emit('newMessage', message);
        }

        this.message = ''
      }
    }
  }
</script>

<style lang="scss">
  .v-textarea textarea {
    line-height: normal !important;
  }
</style>

<style lang="scss" scoped>
  .v-list-item__title {
    white-space: normal !important
  }
</style>
