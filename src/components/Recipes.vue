<template>
  <div>
    <Search></Search>

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
        v-for="recipe in allRecipes"
        :key="recipe.id"
        :recipe="recipe"
        class="mx-auto mb-5"
      ></RecipeCard>
    </div>

    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more" class="text-body-2 text--secondary">Fim dos resultados</div>
    </infinite-loading>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
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
    }),

    async beforeCreate() {
      this.allRecipes = await this.$store.dispatch('recipe/get')
      this.loading = false
    },

    computed: {
      ...mapState({
        recipes: state => state.recipe.recipes,
      }),
    },

    methods: {
      async infiniteHandler($state) {
        const recipes = await this.$store.dispatch('recipe/get', {
          offset: this.allRecipes.length,
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
