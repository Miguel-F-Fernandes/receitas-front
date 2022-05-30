<template>
  <v-container>
    <form>
      <v-row>
        <v-text-field
          label="Nome"
          v-model="name"
          required
          :error-messages="nameErrors"
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
          ref="name"
          v-on:keyup.enter="$refs.email.focus()"
        ></v-text-field>
      </v-row>
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
          v-on:keyup.enter="register()"
        ></v-text-field>
      </v-row>
      <v-row class="mt-5">
        <v-btn block v-on:click="register()" color="primary" :loading="loading" :disabled="loading">
          Cadastrar-se
        </v-btn>
      </v-row>
    </form>

    <v-row class="mt-10">
      <v-btn block v-on:click="login()" color="primary darken-2">
        Já possui conta? Faça login aqui
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
      name: null,
      email: null,
      password: null,
      snackbar: {
        msg: 'Erro ao realizar cadastro',
        show: false,
        timeout: 2000,
      },
      loading: false,
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
      register: async function() {
        this.$v.$touch()
        if (this.$v.$invalid) {
          return
        }
        this.loading = true
        try {
          await this.$store.dispatch('auth/register', {
            name: this.name,
            email: this.email,
            password: this.password,
          })
        } catch (err) {
          this.snackbar.msg = err.response.data
          this.snackbar.show = true
          this.loading = false
          return
        }
        this.loading = false
        this.$router.push({
          path: '/',
        })
      },

      login: function() {
        this.$router.push({
          path: '/login',
        })
      },
    },

    validations: {
      name: { required },
      email: { required, email },
      password: { required },
    },

    computed: {
      nameErrors() {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.required && errors.push('Insira um nome')
        return errors
      },
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
