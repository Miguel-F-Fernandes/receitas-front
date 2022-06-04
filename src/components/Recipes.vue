<template>
  <div>
    <Search :label="$i18n.t('recipes.search')" @update="search = $event" :fields="fields"></Search>

    <div class="d-flex flex-wrap">
      <v-skeleton-loader
        v-show="loading"
        v-for="n in 25"
        :key="n"
        type="card, paragraph"
        min-width="350"
        class="mx-auto mb-5 pa-3"
        elevation="2"
      ></v-skeleton-loader>

      <RecipeCard
        v-for="(recipe, index) in allRecipes"
        :key="index"
        :recipe="recipe"
        class="mx-auto mb-5"
      ></RecipeCard>
    </div>

    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </div>
</template>

<script>
  import RecipeCard from '@/components/RecipeCard.vue'
  import Search from '@/components/Search.vue'

  export default {
    components: {
      RecipeCard,
      Search,
    },

    data: () => ({
      loading: true,
      allRecipes: [],
      search: {},
      fields: null,
    }),

    async beforeCreate() {
      this.allRecipes = await this.$store.dispatch('recipe/get')
      this.fields = await this.$store.dispatch('recipe/getFields')
      this.loading = false
      if (
        Object.keys(this.$route.query) &&
        JSON.stringify(this.search) !== JSON.stringify(this.$route.query)
      ) {
        this.search = this.$route.query
      }
    },

    created() {
      document.title = this.$i18n.t(`toolbar-title.${this.$route.name}`)
      this.$watch(
        () => this.$i18n.locale,
        () => {
          document.title = this.$i18n.t(`toolbar-title.${this.$route.name}`)
        }
      )

      this.$watch(
        () => this.$route.query,
        async to => {
          this.allRecipes = await this.$store.dispatch('recipe/get', to)
        }
      )
    },

    watch: {
      async search(newValue) {
        this.allRecipes = await this.$store.dispatch('recipe/get', newValue)

        this.$router
          .push({
            query: newValue,
            replace: true,
          })
          .catch(err => {
            if (err.name !== 'NavigationDuplicated') throw err
          })
      },
    },

    methods: {
      async infiniteHandler($state) {
        const recipes = await this.$store.dispatch('recipe/get', {
          offset: this.allRecipes.length,
          ...this.search,
        })
        this.allRecipes = this.allRecipes.concat(recipes)
        if (recipes.length) {
          $state.loaded()
        } else {
          $state.complete()
        }
      },
    },
  }
</script>

<style scoped lang="scss"></style>
