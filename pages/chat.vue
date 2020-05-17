<template>
  <div class="d-flex flex-column" :style="{width: '100%', height: heightMessages}">
    <mu-dialog-delete-message v-model="dialog" :message="messageToDialog" @deleteMessage="deleteMessage" />

    <div class="d-flex flex-row my-2 pb-1 pr-1" :style="{borderBottom: '2px solid grey'}">
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
          class="message"
          v-model="text"
          label="Текст сообщения"
          placeholder="Комбинация клавиш для отправки сообщения - Ctrl+Enter"
          hide-details
          outlined
          :rows="rows"
          prepend-icon="far fa-comment-dots"
          @keyup.ctrl.enter="sendMessage"
        />

        <div class="mt-2 d-flex">
          <v-btn v-if="message" small color="error" @click="cancel">
            Отмена
            <v-icon right>fas fa-times</v-icon>
          </v-btn>

          <v-spacer/>

          <v-btn small color="primary" @click="sendMessage">
            Отправить
            <v-icon right>far fa-share-square</v-icon>
          </v-btn>
        </div>
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

              <div v-if="message.fromId == getGambler.id" class="d-flex" :class="message.layout.editButtons.class">
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn icon x-small color="pink" v-on="on" @click="openDialog(message)">
                      <v-icon size="15">fas fa-trash-alt</v-icon>
                    </v-btn>
                  </template>
                  <span>Удалить</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn icon x-small color="indigo" v-on="on" @click="editMessage(message)">
                      <v-icon size="15">fas fa-pencil-alt</v-icon>
                    </v-btn>
                  </template>
                  <span>Редактировать</span>
                </v-tooltip>
              </div>

              <v-list-item-title v-html="message.message"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script>
  import MuDialogDeleteMessage from '~/components/DialogDeleteMessage'

  import {mapGetters} from 'vuex'

  export default {
    name: 'chat',
    async asyncData({store}) {
      await store.dispatch('chat/loadGamblers');
      await store.dispatch('chat/loadMessages')
    },
    data() {
      return {
        dialog: false,
        messageToDialog: null,
        message: null,
        text: ''
      }
    },
    components: {
      MuDialogDeleteMessage
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
            rows = 3;
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
      openDialog(message) {
        this.messageToDialog = message
        this.dialog = true;
      },
      async deleteMessage(data) {
        this.dialog = false;

        if (data.delete) {
          this.messageToDialog = null;
          await this.$socket.emit('deleteMessage', data.message)
        }
      },
      editMessage(message) {
        this.message = {...message};
        this.text = message.message.replace(/<br\/>/g, '\n')
      },
      /*async deleteMessage(message) {
        await this.$socket.emit('deleteMessage', message)
      },*/
      cancel() {
        this.message = null;
        this.text = ''
      },
      async sendMessage(event) {
        if (!this.text.trim()) return;

        if (this.message) {
          this.message.message = this.text.replace(/([^>])\n/g, '$1<br/>')
          this.message.date = this.$moment(this.message.date).format('YYYY-MM-DD HH:mm:ss')

          await this.$socket.emit('editMessage', this.message);

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

        this.text = '';
        event.target.blur()
      }
    }
  }
</script>

<style lang="scss">
  .v-textarea textarea {
    line-height: normal !important;
  }
  .message .v-icon.v-icon {
    color: #1976d2 !important
  }
</style>

<style lang="scss" scoped>
  .v-list-item__title {
    white-space: normal !important
  }
</style>
