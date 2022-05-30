<template>
  <v-container>
    <form>
      <v-row>
        <v-text-field
          label="Email"
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
          label="Senha"
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
          Login
        </v-btn>
      </v-row>
    </form>
    <v-row class="mt-10">
      <v-col>
        <p class="caption">
          Se quiser testar use as credenciais de demo:
          <v-btn
            v-on:click="demoLogin()"
            color="accent"
            :loading="loading"
            :disabled="loading"
            class="ml-2"
          >
            Login demo
          </v-btn>
        </p>
      </v-col>
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
        msg: 'Erro ao realizar login',
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
    },

    validations: {
      email: { required, email },
      password: { required },
    },

    computed: {
      emailErrors() {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.required && errors.push('Insira um email')
        !this.$v.email.email && errors.push('Insira um email válido')
        return errors
      },
      passwordErrors() {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.required && errors.push('Insira a senha')
        return errors
      },
    },
  }
</script>

<style scoped lang="scss"></style>
