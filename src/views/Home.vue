<template>
  <v-container style="height: 100%">
    <v-navigation-drawer
      absolute
      permanent
      expand-on-hover
      app
      style="position: fixed"
      class="grey lighten-3"
    >
      <template v-slot:prepend>
        <v-list-item class="px-2" two-line v-if="user">
          <v-list-item-avatar style="margin-right: 23px">
            <v-avatar color="primary lighten-3" size="40">
              {{
                user.name
                  .split(' ')
                  .map(n => n[0].toUpperCase())
                  .join('')
                  .slice(0, 2)
              }}
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item @click="goTo('RecipeList')">
          <v-list-item-icon>
            <v-icon>mdi-glass-cocktail</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Receitas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goTo('IngredientList')">
          <v-list-item-icon>
            <v-icon>mdi-bottle-wine</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Ingredientes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goTo('MyIngredientList')" v-if="user">
          <v-list-item-icon>
            <v-icon>mdi-wardrobe</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Meu armário</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item @click="logout()" v-if="user">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goTo('Login')" v-else>
          <v-list-item-icon>
            <v-icon>mdi-login-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <router-view></router-view>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    mounted() {
      let token = localStorage.getItem('token')
      if ('token' in localStorage && token !== undefined && token !== null) {
        this.$store.commit('auth/setToken', token)
      }
    },

    computed: {
      ...mapState({
        user: state => state.auth.decodedToken,
      }),
    },

    methods: {
      goTo(name) {
        if (this.$route.name !== name) {
          this.$router.push({
            name,
          })
        }
      },
      logout: async function() {
        await this.$store.dispatch('auth/logout')
      },
    },
  }
</script>

<style scoped lang="scss"></style>
