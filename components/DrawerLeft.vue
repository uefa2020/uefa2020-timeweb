<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    width="150"
    mobile-break-point="800"
    color="purple lighten-5"
  >
    <v-list dense>
      <v-list-item
        v-for="(item, i) in menu"
        :key="i"
        link
        class="px-2 purple--text text--darken-3"
        :to="item.to"
      >
        <v-list-item-action class="mr-1">
          <v-icon small>{{item.icon}}</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>{{item.title}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'DrawerLeft',
    props: {
      value: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        menu: [
          {
            title: 'Участники',
            to: '/gambler',
            icon: 'fas fa-users'
          },
          {
            title: 'Правила',
            to: '/rule',
            icon: 'fas fa-file-alt'
          },
          {
            title: 'Ставки',
            to: '/stake',
            icon: 'fas fa-money-check'
          },
          {
            title: 'Тотализатор',
            to: '/totalizator',
            icon: 'fas fa-money-bill-alt'
          },
          {
            title: 'Чат',
            to: '/chat',
            icon: 'fas fa-comments'
          }
        ]
      }
    },
    created() {
      this.menu.sort((a, b) => {
        // Используем toUpperCase() для преобразования регистра
        const title1 = a.title.toUpperCase();
        const title2 = b.title.toUpperCase();

        return (title1 > title2 ? 1 : -1)
      })
    }
  }
</script>

<style scoped>

</style>
