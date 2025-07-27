import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/image-enhancer.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: ['@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  auth: {
    redirect:{
      login: '/auth/login',
      logout: '/auth/login',
      callback: '/auth/callback',
      home:'/'
    },
    autoFetchUser: false,
    strategies: {
      google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      scheme:'oauth2',
      endpoints:{
        authorization: 'https://accounts.google.com/o/oauth2/auth',
        token: 'https://oauth2.googleapis.com/token',
        userInfo: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      token:{
        property: "access_token",
        type: "Bearer",
        maxAge: 1800,
      },
      responseType: "token id_token",
      scope: ["openid","profile","email"],
      redirectUri: process.env.REDIRECT_URI,
      codeChallengeMethod: "",
    },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        scheme: 'oauth2',
    endpoints: {
      authorization: 'https://github.com/login/oauth/authorize',
      token: 'https://github.com/login/oauth/access_token',
      userInfo: 'https://api.github.com/user'
    },
    responseType: "token id_token",
    scope: ['user', 'email'],
    redirectUri: "http://localhost:3000/callback",
    codeChallengeMethod: ''
  },
    },},
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
