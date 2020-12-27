<template>
  <div class="d-flex flex-column lighten-3" id="landing">
    <!-- <v-container class="d-flex justify-space-between">
         <router-link to="/login">Login</router-link> |
         <router-link to="/register">Cadastrar-se</router-link> |
         <router-link to="/about">Sobre o projeto</router-link> |
         <router-link to="/feedback">Fale conosco</router-link>
         </v-container> -->

    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    mounted() {
      let token = localStorage.getItem('token')
      if ('token' in localStorage && token !== undefined && token !== null) {
        this.$store.commit('auth/setToken', token)
        this.$router.push({
          path: '/',
        })
      }
    },
  }
</script>

<style scoped lang="scss"></style>
