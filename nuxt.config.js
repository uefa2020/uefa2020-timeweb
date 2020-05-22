const pkg = require('./package');

module.exports = {
  mode: 'universal',

  server: {
    //port: (process.env.NODE_ENV === 'production' ? 8080 : 3000),
    //host: (process.env.NOD_ENV === 'production' ? '89.223.122.221' : 'localhost')
    port: '0',
    host: '89.223.122.221'
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: pkg.description}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#4A148C'},

  /*
  ** Global CSS
  */
  css: [],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~/plugins/vuetify', ssr: false},
    {src: '~/plugins/socket', ssr: false}
  ],

  /*
  ** Router settings
  */
  router: {
    middleware: ['auth']
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    /*['@nuxtjs/vuetify', {
      icons: {
        iconfont: 'fa'
      }
    }]*/
  ],

  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/moment'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
};
