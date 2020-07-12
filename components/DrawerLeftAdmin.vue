<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    mobile-breakpoint="600"
    width="215"
  >
    <v-list dense>
      <v-list-item
        v-for="(item, i) in menu"
        :key="i"
        link
        class="px-2 yellow--text"
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
    name: 'DrawerLeftAdmin',
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
            title: 'Письмо для регистрации',
            to: '/admin/email',
            icon: 'fas fa-envelope'
          },
          {
            title: 'Участники',
            to: '',
            icon: 'fas fa-users'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
