<template>
  <v-col
    cols="8" sm="6" md="4" lg="3"
    :style="{position: 'absolute', width: '100%', opacity: '.7'}"
  >
    <v-alert v-if="!!error" type="error" class="text-center">
      {{error}}
    </v-alert>

    <v-card v-else class="elevation-12" color="purple lighten-5">
      <v-toolbar
        color="purple lighten-1"
        dark
        flat
      >
        <v-icon left>fas fa-user-plus</v-icon>
        <v-toolbar-title
          class="text-center"
          :style="{width: '100%', whiteSpace: 'normal !important'}"
        >
          Регистрация в клубе
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="py-1">
        <v-form ref="form" lazy-validation>
          <v-text-field
            label="Ник"
            name="nickname"
            prepend-icon="fas fa-user"
            type="text"
            color="purple lighten-2"
            v-model="nickname"
            :rules="[rules.required]"
          />

          <v-text-field
            label="Пароль"
            name="password"
            prepend-icon="fas fa-lock"
            :append-icon="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            color="purple lighten-2"
            v-model="password"
            :rules="[rules.required]"
          />

          <v-text-field
            label="Подтвердите пароль"
            name="passwordConfirm"
            prepend-icon="fas fa-lock"
            :append-icon="showPasswordConfirm ? 'fas fa-eye' : 'fas fa-eye-slash'"
            :type="showPasswordConfirm ? 'text' : 'password'"
            @click:append="showPasswordConfirm = !showPasswordConfirm"
            color="purple lighten-2"
            v-model="passwordConfirm"
            :rules="[rules.confirm]"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center pt-0 pb-3">
        <v-btn
          :loading="loading"
          :disabled="loading"
          class="white--text"
          color="purple lighten-1"
          @click="signup"
        >
          Зарегистрироваться
          <v-icon right dark small>fas fa-sign-in-alt</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
  export default {
    validate({params}) {
      return Boolean(params.id)
    },
    name: 'signup-id',
    layout: 'start',
    async asyncData({store, params}) {
      const key = params.id;
      let error = '';

      if (key) {
        await store.dispatch('authkey/checkKey', key);
        error = store.getters['authkey/getError'];
      }

      return {key, error}
    },
    data() {
      return {
        nickname: '',
        password: '',
        showPassword: false,
        passwordConfirm: '',
        showPasswordConfirm: false,
        rules: {
          required: value => !!value || 'Поле должно быть заполнено',
          confirm: value => value === this.password || 'Пароли не совпадают'
        },
        loading: false
      }
    },
    methods: {
      async signup() {
        if (!this.$refs.form.validate()) return;

        this.loading = true;

        await this.$store.dispatch('gambler/signup', {
          nickname: this.nickname,
          password: this.password
        });

        this.loading = false;

        if (await this.$store.getters['gambler/isSign']) {
          await this.$store.dispatch('authkey/resetKey', this.key);
          if (!await this.$store.getters['common/isMessage']) {
            this.$router.push('/profile')
          }
        }
      }
    }
  }
</script>

<style scoped>
</style>
