<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    right
    width="230"
    mobile-break-point="700"
    color="purple lighten-5"
  >
    <v-list dense>
      <v-list-item
        v-for="item in gamblers"
        :key="item.id"
        class="px-2"
      >
        <v-list-item-avatar size="35" class="mr-2 my-0 mt-1">
          <v-img :src="`/photo/${item.photo}`"/>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            class="purple--text text--darken-4"
            :style="{whiteSpace: 'normal'}"
          >
            {{item.nickname}}
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-action
          v-if="isStarted"
          class="ml-2 my-0 flex-row align-center justify-between"
          :style="{minWidth: '85px'}"
        >
          <div v-if="item.prev_place > 0">
            <v-icon small :class="getColorStatistic(item.place, item.prev_place)">
              {{getIcon(item.place, item.prev_place)}}
            </v-icon>

            <span class="caption" :class="getColorStatistic(item.place, item.prev_place)">
              {{getStatistic(item.place, item.prev_place)}}
            </span>
          </div>

          <v-chip
            :color="getColorWinner(item.place)"
            class="ml-0 mr-1 white--text"
            label
            small
          >
            {{item.points}}
          </v-chip>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'DrawerRight',
    props: {
      value: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      gamblers() {
        return this.$store.getters['gambler/getGamblers']
      },
      isStarted() {
        const gambler = this.$store.getters['gambler/getGamblers'][0];
        return gambler.points > 0
      }
    },
    methods: {
      getIcon(place, prev) {
        let icon = 'fas fa-arrows-alt-h';

        if (place < prev) {
          icon = 'fas fa-arrow-up';
        } else if (place > prev) {
          icon = 'fas fa-arrow-down';
        }

        return icon;
      },
      getStatistic(place, prev) {
        let statistic = '';

        if (place < prev) {
          statistic = '+' + (prev - place);
        } else if (place > prev) {
          statistic = '-' + (place - prev);
        }

        return statistic;
      },
      getColorStatistic(place, prev) {
        let color = 'green--text text--darken-2';

        if (place < prev) {
          color = 'red--text';
        } else if (place > prev) {
          color = 'blue-grey--text text--darken-3';
        }

        return color;
      },
      getColorWinner(place) {
        let color = 'blue-grey darken-1';

        if (place <= 3) {
          switch (place) {
            case 1:
              color = 'error';
              break;
            case 2:
              color = 'success';
              break;
            case 3:
              color = 'primary';
              break;
          }
        }

        return color;
      }
    }
  }
</script>

<style scoped>

</style>
