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
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },

  loading: {
    color: '#fff'
  },

  css: [],

  plugins: [
    '~/plugins/image-enhancer.js'
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

        clientId: process.env.GOOGLE_CLIENT_ID,

        endpoints: {
          authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
          token: 'https://oauth2.googleapis.com/token',
          userInfo: 'https://openidconnect.googleapis.com/v1/userinfo'
        },

        responseType: 'token id_token',

        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },

        scope: [
          'openid',
          'profile',
          'email'
        ],

        redirectUri:
          process.env.REDIRECT_URI ||
          'https://nuxt-enhancer.vercel.app/auth/callback',

        codeChallengeMethod: '',

        params: {
          prompt: 'select_account'
        }
      },

      github: {
        scheme: 'oauth2',

        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,

        endpoints: {
          authorization:
            'https://github.com/login/oauth/authorize',
          token:
            'https://github.com/login/oauth/access_token',
          userInfo:
            'https://api.github.com/user'
        },

        responseType: 'token',

        scope: [
          'user',
          'email'
        ],

        redirectUri:
          process.env.REDIRECT_URI ||
          'https://nuxt-enhancer.vercel.app/auth/callback',

        codeChallengeMethod: ''
      }
    }
  },

  vuetify: {
    customVariables: [
      '~/assets/variables.scss'
    ],

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