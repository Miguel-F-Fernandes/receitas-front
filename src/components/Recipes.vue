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
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
        class="mx-auto mb-5"
      ></RecipeCard>
    </div>
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
    }),

    async beforeCreate() {
      await Promise.all([this.$store.dispatch('recipe/get')])
      this.loading = false
    },

    computed: {
      ...mapState({
        recipes: state => state.recipe.recipes,
      }),
    },
  }
</script>

<style scoped lang="scss"></style>
