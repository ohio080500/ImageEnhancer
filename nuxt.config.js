import colors from 'vuetify/es5/util/colors'

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID)
console.log('REDIRECT_URI:', process.env.REDIRECT_URI)

export default {
  mode: 'spa',

  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js' },
      { src: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/leaflet-color-markers.js' }
    ]
  },

  loading: { color: '#fff' },

  css: [],

  plugins: [
    '~/plugins/image-enhancer.js',
    '~/plugins/mapPlugin.js'
  ],

  buildModules: [
    '@nuxtjs/vuetify'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      callback: '/auth/callback',
      home: '/'
    },

    autoFetchUser: false,

    strategies: {
      google: {
        scheme: 'oauth2',

        clientId:
          '681717550297-s47pr1ifo65jabmn5p9b8ao1q1dajkfu.apps.googleusercontent.com',

        endpoints: {
          authorization: 'https://accounts.google.com/o/oauth2/auth',
          token: 'https://oauth2.googleapis.com/token',
          userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo'
        },

        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },

        responseType: 'token id_token',

        scope: [
          'openid',
          'profile',
          'email'
        ],

        redirectUri:
          'https://nuxt-enhancer.vercel.app/auth/callback',
          // 'https://nuxt-enhancer.vercel.app/auth/callback

        codeChallengeMethod: ''
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

        responseType: 'token id_token',

        scope: [
          'user',
          'email'
        ],

        redirectUri: process.env.REDIRECT_URI,

        codeChallengeMethod: ''
      }
    }
  },

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

  build: {
    extend(config, ctx) {}
  }
}