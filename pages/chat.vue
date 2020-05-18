<template>
  <div class="d-flex flex-column" :style="{width: '100%', height: '100%'}">
    <mu-dialog-delete-message v-model="dialog" :message="messageToDialog" @deleteMessage="deleteMessage"/>

    <div ref="top" class="d-flex flex-row mt-2 pb-1 pr-1" :style="{borderBottom: '2px solid purple'}">
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
          class="message mb-1"
          v-model="text"
          label="Текст сообщения"
          placeholder="Комбинация клавиш для отправки сообщения - Ctrl+Enter"
          hide-details
          outlined
          :rows="rows"
          prepend-icon="far fa-comment-dots"
          @keyup.ctrl.enter="sendMessage"
        />

        <div v-if="emptyMessage" class="empty-message error--text ml-8 mb-1 caption" :style="{lineHeight: 'normal'}">
          Нельзя отправить пустое сообщение
        </div>

        <div class="d-flex">
          <v-btn v-if="message" class="ml-8" small color="error" @click="cancel">
            Отмена
            <v-icon right>fas fa-times</v-icon>
          </v-btn>

          <v-spacer/>

          <v-btn small color="info" @click="sendMessage">
            Отправить
            <v-icon right>far fa-share-square</v-icon>
          </v-btn>
        </div>
      </v-col>
    </div>

    <div ref="params" :style="{borderBottom: '2px solid purple !important'}">
      <v-card flat color="purple lighten-5">
        <v-card-actions class="pt-0">
          <v-radio-group class="mt-0" row hide-details v-model="range">
            <v-radio
              class="range"
              color="purple"
              v-for="item in rangeMessages"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @change="range = item.value, changeParams()"
            />
          </v-radio-group>

          <v-spacer/>

          <v-checkbox
            class="systemMessages mt-0"
            color="purple"
            hide-details
            v-model="systemMessages"
            label="Показывать системные сообщения"
            @change="setShowSystem = !getShowSystem, changeParams()"
          />
        </v-card-actions>
      </v-card>
    </div>

    <div ref="chat" :style="{maxHeight: `calc(100vh - ${maxHeight})`, overflowY: 'auto'}">
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
                <span class="mr-2">{{$moment(message.date).format('DD.MM.YYYY HH:mm:ss')}}</span>
                <b>{{message.fromNick}}</b>
              </v-list-item-subtitle>

              <!--<v-list-item-subtitle>
                {{message.fromNick}}
              </v-list-item-subtitle>-->

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

  import {mapGetters, mapMutations, mapActions} from 'vuex'

  export default {
    name: 'chat',
    async asyncData({store}) {
      await store.dispatch('chat/loadGamblers');
      await store.dispatch('chat/loadMessages', {range: 1, system: false})
    },
    data() {
      return {
        dialog: false,
        messageToDialog: null,
        message: null,
        text: '',
        rangeMessages: [
          {
            label: 'Вчера/Позавчера',
            value: 1
          },
          {
            label: 'За неделю',
            value: 7
          },
          {
            label: 'Все',
            value: 0
          },
        ],
        emptyMessage: false,
        systemMessages: this.getShowSystem,
        range: 1,
        maxHeight: 0
      }
    },
    components: {
      MuDialogDeleteMessage
    },
    mounted() {
      /*this.loadMessages({range: this.range, system: this.systemMessages});*/

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
        getGambler: 'gambler/getGambler',
        getShowSystem: 'chat/getShowSystem',
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
            width = '65%';
            break;
          case 'md':
            width = '85%';
            break;
          default:
            width = '100%'
        }

        return width
      },
    },
    watch: {
      messages() {
        setTimeout(() => {
          this.$refs.chat.scrollTop = this.range === 1 ? this.$refs.chat.scrollHeight : 0
        })
      },
      systemMessages() {
        this.maxHeight = this.$refs.top.clientHeight + this.$refs['params'].clientHeight + 125;
        this.maxHeight += 'px'
      }
    },
    methods: {
      ...mapMutations({
        setShowSystem: 'chat/SET_SHOW_SYSTEM'
      }),
      ...mapActions({
        loadMessages: 'chat/loadMessages'
      }),
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
        this.emptyMessage = false;

        this.message = {...message};
        this.text = message.message.replace(/<br\/>/g, '\n')
      },
      /*async deleteMessage(message) {
        await this.$socket.emit('deleteMessage', message)
      },*/
      cancel() {
        this.emptyMessage = false;
        this.message = null;
        this.text = ''
      },
      async changeParams() {
        await this.loadMessages({
          range: this.range,
          system: this.systemMessages
        })
      },
      async sendMessage(event) {
        if (!this.text.trim()) {
          this.emptyMessage = true;
          return
        };

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
        this.emptyMessage = false;
        //event.target.blur()
      }
    }
  }
</script>

<style lang="scss">
  .message.v-textarea textarea {
    line-height: normal !important;
  }

  .message .v-icon.v-icon {
    color: #1976d2 !important
  }

  .range .v-label,
  .systemMessages .v-label {
    color: purple !important
  }
</style>

<style lang="scss" scoped>
  .v-list-item__title {
    white-space: normal !important
  }
</style>
