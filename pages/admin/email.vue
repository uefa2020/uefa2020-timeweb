<template>
  <v-card
    class="mx-auto align-self-start mt-12"
  >
    <v-card-title>
      Отправить письмо для регистрации
    </v-card-title>

    <v-card-actions class="flex-column">
      <v-text-field ref="email" label="e-mail" v-model="email" :rules="rules">
        <v-icon slot="prepend" small class="mt-1">fas fa-envelope</v-icon>
      </v-text-field>

      <v-btn
        :loading="loading"
        :disabled="loading"
        @click="sendMail"
      >
        Отправить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
	export default {
		name: 'email',
    layout: 'admin',
    data() {
		  return {
		    email: '',
        rules: [
          value => !!value || 'Поле не может быть пустым.',
          value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Неверный формат e-mail.'
          },
        ],
        loading: false
      }
    },
    methods: {
		  async sendMail() {
        if (!this.$refs['email'].validate()) return;

        this.loading = true;

        await this.$store.dispatch('email/sendMail', this.email);

        this.loading = false;
      }
    }
	}
</script>

<style scoped>

</style>
