<template>
  <div :style="{width: '100%'}">
    <h2 class="text-center my-2 purple--text">Участники</h2>
    <div class="d-flex flex-wrap flex-row justify-center px-1">
      <v-card
        v-for="(gambler, i) in gamblers"
        :key="gambler.id"
        max-width="125"
        outlined
        class="mb-1 dark blue-grey lighten-4"
        :class="i > 0 ? 'ml-1' : ''"
        :style="{border: '1px solid ' + (gambler.sex === 'ж' ? 'red' : 'blue') + ' !important'}"
      >
        <v-img
          lazy-src="/user.jpg"
          :src="`/photo/${gambler.photo}`"
          class="white--text align-end"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular indeterminate color="black"></v-progress-circular>
            </v-row>
          </template>
        </v-img>

        <v-card-title
          class="pa-1 flex-column caption text-center"
          style="word-break: normal !important"
          :style="{borderTop: '1px solid ' + (gambler.sex === 'ж' ? 'red' : 'blue') + ' !important'}"
        >
          <div>{{gambler.family}} {{gambler.name}}</div>
          <div>({{gambler.nickname}})</div>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'gambler',
    computed: {
      ...mapGetters({
        getGamblersOrderByNick: 'gambler/getGamblersOrderByNick'
      }),
      gamblers() {
        return this.getGamblersOrderByNick
      }
    }
  }
</script>

<style scoped>

</style>
