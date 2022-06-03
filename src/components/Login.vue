<template>
  <v-container>
    <v-row>
      <v-col>
        <p class="caption">
          {{ $i18n.t('login.demo.text') }}
          <v-btn
            v-on:click="demoLogin()"
            color="accent darken-1"
            :loading="loading"
            :disabled="loading"
            class="ml-2"
          >
            {{ $i18n.t('login.demo.button') }}
          </v-btn>
        </p>
      </v-col>
    </v-row>

    <form>
      <v-row>
        <v-text-field
          :label="$i18n.t('login.name')"
          v-model="email"
          required
          :error-messages="emailErrors"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
          ref="email"
          v-on:keyup.enter="$refs.password.focus()"
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          :label="$i18n.t('login.password')"
          v-model="password"
          required
          :error-messages="passwordErrors"
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
          ref="password"
          type="password"
          v-on:keyup.enter="login()"
        ></v-text-field>
      </v-row>
      <v-row class="mt-5">
        <v-btn block v-on:click="login()" color="primary" :loading="loading" :disabled="loading">
          {{ $i18n.t('login.login') }}
        </v-btn>
      </v-row>
    </form>

    <v-divider class="mx-5"></v-divider>

    <v-row class="mt-10">
      <p class="caption" v-if="$vuetify.breakpoint.smAndDown">
        {{ $i18n.t('login.register.text') }}
      </p>
      <v-btn block v-on:click="register()" color="primary darken-2">
        {{ $vuetify.breakpoint.smAndDown ? '' : $i18n.t('login.register.text') }}
        {{ $i18n.t('login.register.button') }}
      </v-btn>
    </v-row>

    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout">
      {{ snackbar.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          OK
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],

    data: () => ({
      email: null,
      password: null,
      snackbar: {
        msg: 'Error when trying to login',
        show: false,
        timeout: 2000,
      },
      loading: false,
      demo: {
        email: 'email@falso.com',
        password: '1234',
      },
    }),

    mounted() {
      let token = localStorage.getItem('token')
      if ('token' in localStorage && token !== undefined && token !== null) {
        this.$router.push({
          path: '/',
        })
      }
    },

    methods: {
      login: async function() {
        this.$v.$touch()
        if (this.$v.$invalid) {
          return
        }
        this.loading = true
        try {
          await this.$store.dispatch('auth/login', {
            email: this.email,
            password: this.password,
          })
        } catch (err) {
          this.loading = false
          this.snackbar.show = true
          return
        }
        this.loading = false
        this.$router.push({
          path: '/',
        })
      },

      demoLogin: async function() {
        this.loading = true
        try {
          await this.$store.dispatch('auth/login', {
            email: this.demo.email,
            password: this.demo.password,
          })
        } catch (err) {
          this.loading = false
          this.snackbar.show = true
          return
        }
        this.loading = false
        this.$router.push({
          path: '/',
        })
      },

      register: function() {
        this.$router.push({
          path: '/register',
        })
      },
    },

    validations: {
      email: { required, email },
      password: { required },
    },

    computed: {
      emailErrors() {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.required && errors.push(this.$i18n.t('login.errors.email'))
        !this.$v.email.email && errors.push(this.$i18n.t('login.errors.valid-email'))
        return errors
      },
      passwordErrors() {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.required && errors.push(this.$i18n.t('login.errors.password'))
        return errors
      },
    },
  }
</script>

<style scoped lang="scss"></style>
