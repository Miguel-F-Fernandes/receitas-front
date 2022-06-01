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
            <v-avatar color="primary" size="40" style="color: white">
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

      <template v-slot:append>
        <v-list dense>
          <v-dialog max-width="600" v-model="feedbackDialog">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-message-alert-outline</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Feedback</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-card>
              <v-card-title class="text-h5">
                Give us your feedback
              </v-card-title>
              <v-card-text
                >Feel free to leave us an anonymous message with any part of our system you would
                like us to improve, or possible feature you would like to see implemented in the
                future. 😁
              </v-card-text>

              <v-card-subtitle>
                <v-textarea outlined auto-grow v-model="feedback" hide-details="auto"></v-textarea>
              </v-card-subtitle>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="sendFeedback">
                  Send
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item @click="goTo('RecipeList')">
          <v-list-item-icon>
            <v-icon>mdi-glass-cocktail</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Recipes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goTo('IngredientList')">
          <v-list-item-icon>
            <v-icon>mdi-bottle-wine</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Ingredients</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goTo('MyIngredientList')" v-if="user">
          <v-list-item-icon>
            <v-icon>mdi-wardrobe</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>My cabinet</v-list-item-title>
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
    data: () => ({
      feedback: null,
      feedbackDialog: false,
    }),

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
      async logout() {
        await this.$store.dispatch('auth/logout')
      },
      async sendFeedback() {
        if (!this.feedback) {
          this.feedbackDialog = false
        }
        await this.$store.dispatch('feedback/submit', { text: this.feedback })
        this.feedbackDialog = false
        this.feedback = null
      },
    },
  }
</script>

<style scoped lang="scss"></style>
