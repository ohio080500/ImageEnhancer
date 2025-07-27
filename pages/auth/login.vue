<template>
  <div class="login-page">
    <div class="d-flex justify-center align-center" style="height: 100vh;">
      <v-card
        class="login-card"
        elevation="12"
        color="#1e1e1e"
      >
        <v-card-text>
          <h1 class="text-h4 text-center mb-6" style="color: white;">Login</h1>

          <v-text-field
            label="Email"
            prepend-icon="mdi-email"
            color="primary"
            class="mb-4"
            outlined
          ></v-text-field>

          <v-text-field
            
            label="Password"
            prepend-icon="mdi-lock"
            color="primary"
            class="mb-4"
            outlined
            type="password"
            
            
          ></v-text-field>
          <v-btn
            color="primary"
            elevation="2"
            block
            class="mb-6"
          >
            Sign In
          </v-btn>

          <div class="text-center mb-4">
            <p style="color: white;">or</p>
          </div>
          

           <div class="google-btn-wrapper">
            <v-btn
              color="red darken-1"
              class="ma-2"
              elevation="2"
              @click="signInWithGoogle()"
            >
              <v-icon left>mdi-google</v-icon>
              Sign in with Google
            </v-btn>
          </div>
          <div class="google-btn-wrapper">
            <v-btn
              color="grey darken-4"
              class="ma-2"
              elevation="2"
              @click="signInWithGithub"
            >
              <v-icon left>mdi-github</v-icon>
              Sign in with Github
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    
    return {
      email: '',
      password: ''
    }
  },
  layout: 'auth',
  middleware: 'guest',
  methods: {
    async login() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        this.$router.push('/')
      } catch (err) {
        alert('Invalid credentials')
      }
    },
    signInWithGoogle() {
      this.$auth.loginWith('google')
    },
    signInWithGithub() {
      this.$auth.loginWith('github')
    }
  }
}
</script>

<style scoped>
.login-container {
  background-color: #524f4f;

}

.login-card {
  width: 100%;
  max-width: 500px;
  padding: 32px 24px;
  position: relative;
  border-radius: 16px;
}

.google-btn-wrapper {
  display: flex;
  justify-content: center;
}
</style>
