<template>
  <div style="height: 100%">
    <v-app-bar
      app
      dense
      fixed
      :hide-on-scroll="!topOfScreen"
      v-if="$vuetify.breakpoint.smAndDown && !drawer"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>{{
        this.$route.name ? $i18n.t(`toolbar-title.${this.$route.name}`) : title
      }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu top close-on-click>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <div class="language">
              {{ $i18n.locale.toUpperCase() }}
            </div>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(lang, index) in langs"
            :key="'lang-app-' + index"
            :value="lang"
            @click="setLocale(lang)"
          >
            <v-list-item-title>{{ lang.toUpperCase() }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-dialog max-width="600" v-model="feedbackDialog">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-message-alert-outline</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5">
            {{ $i18n.t('feedback.title') }}
          </v-card-title>
          <v-card-text>
            {{ $i18n.t('feedback.body') }}
          </v-card-text>

          <v-card-subtitle>
            <v-textarea outlined auto-grow v-model="feedback" hide-details="auto"></v-textarea>
          </v-card-subtitle>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="sendFeedback">
              {{ $i18n.t('feedback.send') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-navigation-drawer
      absolute
      :permanent="$vuetify.breakpoint.smAndUp"
      :expand-on-hover="$vuetify.breakpoint.smAndUp"
      app
      style="position: fixed"
      class="grey lighten-3"
      v-model="drawer"
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
        <v-list dense v-if="$vuetify.breakpoint.smAndUp">
          <!-- language picker -->
          <v-menu top close-on-click>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <div class="language">
                    {{ $i18n.locale.toUpperCase() }}
                  </div>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ $i18n.t('menu.language') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list>
              <v-list-item
                v-for="(lang, index) in langs"
                :key="'lang-drawer-' + index"
                :value="lang"
                @click="setLocale(lang)"
              >
                <v-list-item-title>{{ lang.toUpperCase() }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- feedback dialog -->
          <v-dialog max-width="600" v-model="feedbackDialog">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-message-alert-outline</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ $i18n.t('menu.feedback') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-card>
              <v-card-title class="text-h5">
                {{ $i18n.t('feedback.title') }}
              </v-card-title>
              <v-card-text>
                {{ $i18n.t('feedback.body') }}
              </v-card-text>

              <v-card-subtitle>
                <v-textarea outlined auto-grow v-model="feedback" hide-details="auto"></v-textarea>
              </v-card-subtitle>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="sendFeedback">
                  {{ $i18n.t('feedback.send') }}
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
            <v-list-item-title>{{ $i18n.t('menu.recipes') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goTo('IngredientList')">
          <v-list-item-icon>
            <v-icon>mdi-bottle-wine</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ $i18n.t('menu.ingredients') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goTo('MyIngredientList')" v-if="user">
          <v-list-item-icon>
            <v-icon>mdi-wardrobe</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ $i18n.t('menu.my-ingredients') }}</v-list-item-title>
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
            <v-list-item-title>{{ $i18n.t('menu.logout') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goTo('Login')" v-else>
          <v-list-item-icon>
            <v-icon>mdi-login-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ $i18n.t('menu.login') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-container style="height: 100%">
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data: () => ({
      drawer: false,
      feedback: null,
      feedbackDialog: false,
      langs: ['en', 'br'],
      title: null,
      topOfScreen: true,
    }),

    created() {
      this.title = document.title
      new MutationObserver(() => {
        this.title = document.title
      }).observe(document.querySelector('title'), { childList: true })

      let locale = localStorage.getItem('locale')
      if (
        'locale' in localStorage &&
        locale !== undefined &&
        locale !== null &&
        this.langs.includes(locale)
      ) {
        this.$i18n.locale = locale
      }
    },

    mounted() {
      let token = localStorage.getItem('token')
      if ('token' in localStorage && token !== undefined && token !== null) {
        this.$store.commit('auth/setToken', token)
      }
      window.addEventListener('scroll', this.onScroll)
    },

    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
    },

    computed: {
      ...mapState({
        user: state => state.auth.decodedToken,
      }),
    },

    methods: {
      setLocale(locale) {
        this.$i18n.locale = locale
        localStorage.setItem('locale', locale)
      },

      onScroll() {
        this.topOfScreen = !window.scrollY
      },

      goTo(name) {
        if (this.$route.name !== name) {
          this.$router.push({
            name,
          })
        }
      },

      async logout() {
        await this.$store.dispatch('auth/logout')
        // check if current route needs authentication
        this.$router.currentRoute.matched.forEach(route => {
          if (route.meta.requiresAuth) {
            this.$router.push({
              path: '/',
            })
          }
        })
      },

      async sendFeedback() {
        if (!this.feedback) {
          this.feedbackDialog = false
          return
        }
        await this.$store.dispatch('feedback/submit', { text: this.feedback })
        this.feedbackDialog = false
        this.feedback = null
      },
    },
  }
</script>

<style scoped lang="scss">
  .v-card__title {
    word-break: keep-all;
  }
  .language {
    heith: 24px;
    width: 24px;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.54);
    padding-left: 0.15em;
    font-weight: bold;
  }
</style>
