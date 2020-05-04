<template>
  <v-menu nudge-bottom="30" nudge-right="45" open-on-hover>
    <template v-slot:activator="{ on }">
      <div
        class="ml-1 mr-5"
        v-on="on"
        :style="{cursor: 'pointer', color: 'yellow'}"
      >
        <v-avatar width="40" height="40" color="yellow">
          <img
            :src="`/photo/${gambler.photo}`"
            :alt="gambler.nickname"
          >
        </v-avatar>

        {{gambler.nickname}}
      </div>
    </template>

    <v-list class="py-1" light color="yellow lighten-2">
      <v-list-item
        class="px-3 mb-1"
        :style="{minHeight: '10px'}"
        @click="$router.push('/')"
      >
        <v-list-item-title class="caption text-center">
          На сайт
        </v-list-item-title>
      </v-list-item>

      <v-divider class="mb-1"/>

      <v-list-item
        class="px-3"
        :style="{minHeight: '10px'}"
        @click="openDialog"
      >
        <v-list-item-title class="caption text-center">
          Выход
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
	export default {
		name: 'HeaderUserAdmin',
    computed: {
      gambler() {
        return this.$store.getters['gambler/getGambler'];
      }
    },
    methods: {
      openDialog() {
        this.$emit('openDialog', {dialog: true});
      }
    }
	}
</script>

<style scoped>

</style>
