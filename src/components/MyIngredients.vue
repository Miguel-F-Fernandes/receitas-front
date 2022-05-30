<template>
  <div>
    <Search label="Buscar ingredientes" @update="search = $event"></Search>

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

      <IngredientCard
        v-for="ingredient in allIngredients"
        :key="ingredient.id"
        :ingredient="ingredient"
        class="mx-auto mb-5"
      ></IngredientCard>
    </div>

    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more" class="text-body-2 text--secondary">Fim dos resultados</div>
    </infinite-loading>
  </div>
</template>

<script>
  import IngredientCard from '@/components/IngredientCard.vue'
  import Search from '@/components/Search.vue'

  export default {
    components: {
      IngredientCard,
      Search,
    },

    data: () => ({
      loading: true,
      allIngredients: [],
      search: {},
    }),

    async beforeCreate() {
      this.allIngredients = await this.$store.dispatch('my-ingredient/get')
      this.loading = false
      if (
        Object.keys(this.$route.query) &&
        JSON.stringify(this.search) !== JSON.stringify(this.$route.query)
      ) {
        this.search = this.$route.query
      }
    },

    watch: {
      async search(newValue) {
        console.log('search')
        this.allIngredients = await this.$store.dispatch('my-ingredient/get', newValue)
        this.respondToRouteChanges = false
        this.$router.replace({ query: newValue }).finally(() => {
          this.respondToRouteChanges = true
        })
      },
    },

    methods: {
      async infiniteHandler($state) {
        const ingredients = await this.$store.dispatch('my-ingredient/get', {
          offset: this.allIngredients.length,
          ...this.search,
        })
        this.allIngredients = this.allIngredients.concat(ingredients)
        if (ingredients.length) {
          $state.loaded()
        } else {
          $state.complete()
        }
      },
    },
  }
</script>

<style scoped lang="scss"></style>
