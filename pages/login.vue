<template>
  <v-col
    cols="8" sm="6" md="4" lg="3"
    :style="{position: 'absolute', width: '100%', opacity: '.7'}"
  >
    <v-card class="elevation-12" color="purple lighten-5">
      <v-toolbar
        color="purple lighten-1"
        dark
        flat
        height="35"
      >
        <v-icon left>fas fa-user-lock</v-icon>
        <v-toolbar-title
          class="text-center"
          :style="{width: '100%', whiteSpace: 'normal !important'}"
        >
          Вход в клуб
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="py-1">
        <v-form ref="form" lazy-validation>
          <v-text-field
            label="Логин"
            name="login"
            prepend-icon="fas fa-user"
            type="text"
            light
            color="purple lighten-2"
            v-model="login"
            :rules="[rules.required]"
          />

          <v-text-field
            label="Пароль"
            name="password"
            prepend-icon="fas fa-lock"
            :append-icon="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            light
            color="purple lighten-2"
            v-model="password"
            :rules="[rules.required]"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center pt-0 pb-3">
        <v-btn
          :loading="loading"
          :disabled="loading"
          class="white--text"
          color="purple lighten-1"
          @click="auth"
        >
          Войти
          <v-icon right dark small>fas fa-door-open</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    layout: 'start',
    data() {
      return {
        login: '',
        password: '',
        showPassword: false,
        rules: {
          required: value => !!value || 'Поле должно быть заполнено'
        },
        loading: false
      }
    },
    computed: {
      ...mapGetters({
        getIsSign: 'gambler/isSign',
        getIsAuth: 'gambler/isAuth',
        getGambler: 'gambler/getGambler'
      })
    },
    methods: {
      ...mapActions({
        actionLogin: 'gambler/login'
      }),
      async auth() {
        if (!this.$refs.form.validate()) return;

        this.loading = true;

        await this.actionLogin({
          login: this.login,
          password: this.password
        });

        this.loading = false;

        if (this.getIsSign) {
          await this.$router.push('/profile')
        } else if (this.getIsAuth) {
          await this.$socket.emit('login', this.getGambler);
          await this.$router.push('/chat')
        }
      }
    }
    /*computed: {
      width() {
        let width = 0;
        switch (this.$vuetify.breakpoint.name) {
          case 'lg':
            width = 1100;
            break;
          case 'md':
            width = 960;
            break;
          case 'sm':
            width = 600;
            break;
          default:
            width = 450
        }

        return width
      },
      breakpoint() {
        return this.$vuetify.breakpoint.name
      }
    }*/
  }
</script>

<style>
</style>
