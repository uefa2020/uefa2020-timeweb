<template>
  <v-dialog
    :value="value"
    max-width="275"
    persistent
    light
  >
    <v-card border="left">
      <v-card-title
        class="dark blue-grey lighten-3 pa-2 caption"
      >
        Выход из приложения
      </v-card-title>

      <v-card-text
        class="d-flex align-center blue-grey lighten-5 body-2 pa-5"
        :style="{borderTop: '1px #777 solid !important', borderBottom: '1px #777 solid !important'}"
      >
        <v-icon large>fas fa-question-circle</v-icon>
        <div class="ml-3">Вы действительно хотите выйти?</div>
      </v-card-text>

      <v-card-actions
        class="dark blue-grey lighten-4 py-2 px-5"
      >
        <v-spacer></v-spacer>

        <v-btn
          class="py-1"
          color="secondary"
          text
          outlined
          small
          @click="cancel"
        >
          Нет
        </v-btn>

        <v-btn
          class="py-1"
          color="red"
          text
          outlined
          small
          @click="close"
        >
          Да
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'dialog-exit',
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      cancel() {
        this.$emit('closeApp', {close: false});
      },
      close() {
        this.$emit('closeApp', {close: true});
      }
    }
  }
</script>

<style scoped>

</style>
