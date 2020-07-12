<template>
  <v-app>
    <v-snackbar
      v-model="snackbar"
      top
      :color="color"
    >
      <!--<v-icon color="yellow" class="mr-5">fas fa-exclamation-circle</v-icon>-->
      <div class="text-center" :style="{width: '100%'}">{{message}}</div>
    </v-snackbar>

    <div class="d-flex px-1 py-2 d-sm-none flex-column purple lighten-3 yellow--text text--lighten-3">
      <span class="display-1 text-center">Закрытый Клуб</span>
      <span class="title text-center">любителей футбола и острых ощущений</span>
    </div>

    <v-main>
      <v-container
        class="fill-height purple lighten-4 pa-0"
        fluid
      >
        <v-row justify="center" align="center">
          <v-col cols="12" class="pa-0">
            <v-card
              class="mx-auto"
            >
              <v-img
                class="white--text hidden-xs-only purple lighten-4"
                src="/main.jpg"
                contain
              >
                <!--<v-card-title class="fill-height">
                  <nuxt />
                </v-card-title>-->
              </v-img>
            </v-card>
          </v-col>

          <nuxt/>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'start',
    data() {
      return {
        snackbar: false,
        message: '',
        color: ''
      }
    },
    computed: {
      ...mapGetters({
        getMessage: 'common/getMessage',
        isMessage: 'common/isMessage'
      }),
      checkMessage() {
        return this.isMessage;
      }
    },
    watch: {
      checkMessage(isMessage) {
        if (isMessage) {
          const message = this.getMessage;
          this.color = message.status;
          this.message = message.text;
          this.snackbar = true
        }
      }
    }
  }
</script>

<style scoped>

</style>
