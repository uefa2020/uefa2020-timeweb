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

    <v-main>
      <v-container
        class="fill-height purple lighten-4"
        fluid
      >
        <nuxt/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    name: 'auth',
    data() {
      return {
        snackbar: false,
        message: '',
        color: ''
      }
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
    }
  }
</script>

<style scoped>

</style>
