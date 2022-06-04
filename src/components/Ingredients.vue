<template>
  <div>
    <Search
      :label="$i18n.t('ingredients.search')"
      @update="search = $event"
      :fields="fields"
    ></Search>

    <div class="d-flex flex-wrap">
      <v-skeleton-loader
        v-show="loading"
        v-for="n in 25"
        :key="'skel-' + n"
        type="card, paragraph"
        min-width="350"
        class="mx-auto mb-5 pa-3"
        elevation="2"
      ></v-skeleton-loader>

      <IngredientCard
        v-for="(ingredient, index) in allIngredients"
        :key="'ingr-' + index"
        :ingredient="ingredient"
        class="mx-auto mb-5"
      ></IngredientCard>
    </div>

    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
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
      fields: null,
    }),

    async beforeCreate() {
      this.allIngredients = await this.$store.dispatch('ingredient/get')
      this.fields = await this.$store.dispatch('ingredient/getFields')
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
          this.allIngredients = await this.$store.dispatch('ingredient/get', to)
        }
      )
    },

    watch: {
      async search(newValue) {
        this.allIngredients = await this.$store.dispatch('ingredient/get', newValue)

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
        const ingredients = await this.$store.dispatch('ingredient/get', {
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
