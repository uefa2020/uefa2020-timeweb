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

    <!-- Диалог подтверждения выхода из приложения -->
    <mu-dialog-exit v-model="dialog" @closeApp="closeApp" />

    <mu-drawer-left-admin v-model="drawer" />

    <!---------------------------------------------------------------------------------->
    <!-- ЗАГОЛОВОК -->
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title class="pl-0 yellow--text">Тотализатор</v-toolbar-title>

      <v-spacer/>

      <mu-header-user-admin @openDialog="isOpenDialog" />
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <nuxt/>
      </v-container>
    </v-content>

    <!---------------------------------------------------------------------------------->
    <!-- ПОДВАЛ -->
    <mu-footer textColor="yellow" />
  </v-app>
</template>

<script>
  import MuDrawerLeftAdmin from '~/components/DrawerLeftAdmin'
  import MuFooter from '~/components/Footer'
  import MuHeaderUserAdmin from '~/components/HeaderUserAdmin'
  import MuDialogExit from '~/components/DialogExit'

  export default {
    data: () => ({
      dialog: false,
      drawer: true,
      snackbar: false,
      message: '',
      color: ''
    }),
    components: {
      MuDrawerLeftAdmin,
      MuHeaderUserAdmin,
      MuFooter,
      MuDialogExit
    },
    created() {
      this.$vuetify.theme.dark = true
    },
    computed: {
      isMessage() {
        return this.$store.getters['common/isMessage'];
      }
    },
    watch: {
      isMessage(isMessage) {
        if (isMessage) {
          const message = this.$store.getters['common/getMessage'];
          this.color = message.status;
          this.message = message.text;
          this.snackbar = true
        }
      }
    },
    methods: {
      isOpenDialog(data) {
        this.dialog = data.dialog
      },
      async closeApp(data) {
        this.dialog = false;

        if (data.close) {
          await this.$store.dispatch('gambler/logout');
          this.$router.push('/login');
        }
      }
    }
  }
</script>

<style scoped>

</style>
