<template>
  <v-app>
    <v-snackbar
      v-model="snackbar"
      top
      :color="color"
    >
      <div class="text-center" :style="{width: '100%'}">{{message}}</div>
    </v-snackbar>

    <!-- Диалог подтверждения выхода из приложения -->
    <mu-dialog-exit v-model="dialog" @closeApp="closeApp" />

    <!-- Левая панель - МЕНЮ -->
    <mu-drawer-left v-model="drawer"/>

    <!---------------------------------------------------------------------------------->
    <!-- ЗАГОЛОВОК -->
    <v-app-bar
      app
      clipped-right
      clipped-left
      color="purple lighten-1"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">{{drawer ? 'far fa-hand-point-left' : 'far fa-hand-point-right'}}</v-icon>
          </template>
          <span class="caption">{{drawer ? 'Скрыть меню' : 'Показать меню'}}</span>
        </v-tooltip>
      </v-app-bar-nav-icon>

      <v-toolbar-title>Тотализатор</v-toolbar-title>

      <v-spacer/>

      <mu-header-user @openDialog="isOpenDialog"/>

      <v-app-bar-nav-icon class="ml-md-12" @click.stop="drawerRight = !drawerRight">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">{{drawerRight ? 'far fa-hand-point-right' : 'far fa-hand-point-left'}}</v-icon>
          </template>
          <span class="caption">{{drawerRight ? 'Скрыть результаты' : 'Показать результаты'}}</span>
        </v-tooltip>
      </v-app-bar-nav-icon>
    </v-app-bar>

    <!---------------------------------------------------------------------------------->
    <!-- КОНТЕНТ -->
    <v-content>
      <v-container
        class="fill-height align-start purple lighten-4 pa-0"
        fluid
      >
        <nuxt/>
      </v-container>
    </v-content>

    <!---------------------------------------------------------------------------------->
    <!-- Правая панель - РЕЗУЛЬТАТ ТОТАЛИЗАТОРА -->
    <mu-drawer-right v-model="drawerRight"/>

    <!---------------------------------------------------------------------------------->
    <!-- ПОДВАЛ -->
    <mu-footer color="purple lighten-1"/>
  </v-app>
</template>

<script>
  import MuDrawerLeft from '~/components/DrawerLeft'
  import MuDrawerRight from '~/components/DrawerRight'
  import MuHeaderUser from '~/components/HeaderUser'
  import MuFooter from '~/components/Footer'
  import MuDialogExit from '~/components/DialogExit'

  export default {
    data: () => ({
      dialog: false,
      drawer: true,
      drawerRight: true,
      snackbar: false,
      message: '',
      color: ''
    }),
    components: {
      MuDrawerLeft,
      MuDrawerRight,
      MuHeaderUser,
      MuFooter,
      MuDialogExit
    },
    created() {
      this.$vuetify.theme.dark = false;
      this.drawer = this.$vuetify.breakpoint.width < 800 ? false : true;
      this.drawerRight = this.$vuetify.breakpoint.width < 700 ? false : true;
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
