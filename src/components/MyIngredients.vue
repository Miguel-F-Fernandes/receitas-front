<template>
  <div>
    <v-autocomplete
      v-model="backendModel"
      :items="backendEntries"
      :loading="backendLoading"
      :search-input.sync="backendSearch"
      hide-no-data
      hide-selected
      item-text="name"
      item-value="id"
      :label="$i18n.t('my-ingredients.search')"
      :placeholder="$i18n.t('my-ingredients.search-placeholder')"
      prepend-icon="mdi-database-search"
      return-object
      dense
      outlined
      :filter="filterBackend"
    >
      <template v-slot:append-item>
        <div v-intersect="loadMore"></div>
      </template>
    </v-autocomplete>

    <div class="d-flex flex-wrap">
      <v-skeleton-loader
        v-show="loading"
        v-for="n in 25"
        :key="n"
        type="card, paragraph"
        min-width="400"
        class="mx-auto mb-5 pa-3"
        elevation="2"
      ></v-skeleton-loader>

      <v-card
        width="260"
        class="d-flex mx-auto mb-5"
        v-for="(ingredient, index) in allIngredients"
        :key="ingredient.id"
      >
        <div class="d-flex justify-space-between" style="width: 100%">
          <div class="d-flex flex-column justify-space-between">
            <v-card-title>{{ ingredient.name }}</v-card-title>
            <v-card-text class="font-weight-light cursor-pointer" @click="goToRecipes(ingredient)">
              {{ ingredient._count.recipes }} {{ $i18n.t('my-ingredients.recipe')
              }}{{ ingredient._count.recipes > 1 ? 's' : '' }}
            </v-card-text>
          </div>

          <v-btn icon color="red darken-4" @click="remove(index)">
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </div>
      </v-card>
    </div>

    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </div>
</template>

<script>
  export default {
    data: () => ({
      loading: true,
      allIngredients: [],
      search: null,
      fields: null,
      backendSearch: null,
      backendModel: null,
      backendLoading: false,
      backendEntries: [],
      debounceOptions: {
        delay: 500, // in milliseconds
        timeout: null,
      },
      allowLoadMore: true,
    }),

    async beforeCreate() {
      this.allIngredients = await this.$store.dispatch('my-ingredient/get')
      this.fields = await this.$store.dispatch('my-ingredient/getFields')
      this.loading = false
      if (
        Object.keys(this.$route.query) &&
        JSON.stringify(this.search) !== JSON.stringify(this.$route.query)
      ) {
        this.search = this.$route.query
      }
    },

    created() {
      this.$watch(
        () => this.$route.query,
        async to => {
          this.allIngredients = await this.$store.dispatch('ingredient/get', to)
        }
      )
    },

    watch: {
      async search(newValue) {
        this.allIngredients = await this.$store.dispatch('my-ingredient/get', newValue)

        this.$router
          .push({
            query: newValue,
            replace: true,
          })
          .catch(err => {
            if (err.name !== 'NavigationDuplicated') throw err
          })
      },

      backendSearch(newValue) {
        // items have already been requested
        if (this.backendLoading) return

        if (!newValue) return

        this.debounce(this.queryBackend.bind(this, newValue))()
      },

      async backendModel(newValue) {
        if (!newValue) return

        // an item was selected
        await this.$store.dispatch('my-ingredient/add', { id: newValue.id })
        this.allIngredients.push(newValue)
        this.backendSearch = null
        this.backendModel = null
      },
    },

    methods: {
      debounce(func) {
        return () => {
          let later = () => {
            this.debounceOptions.timeout = null
            func.apply(this)
          }
          clearTimeout(this.debounceOptions.timeout)
          this.debounceOptions.timeout = setTimeout(later, this.debounceOptions.delay)
        }
      },

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

      async queryBackend(value) {
        this.allowLoadMore = true
        this.backendLoading = true
        this.backendEntries = await this.$store.dispatch('ingredient/get', {
          'name[contains]': value,
        })
        this.backendLoading = false
      },

      async loadMore(entries, observer, isIntersecting) {
        if (!isIntersecting || !this.allowLoadMore) return

        this.backendLoading = true
        let newEntries = await this.$store.dispatch('ingredient/get', {
          offset: this.backendEntries.length,
          'name[contains]': this.backendSearch,
        })
        this.backendEntries = this.entries.concat(newEntries)
        this.backendLoading = false

        if (!newEntries.length) {
          this.allowLoadMore = false
        }
      },

      filterBackend(item) {
        return !this.allIngredients.find(myItem => myItem.id === item.id)
      },

      async remove(index) {
        let item = this.allIngredients.splice(index, 1)[0]
        await this.$store.dispatch('my-ingredient/remove', { id: item.id })
      },

      goToRecipes(ingredient) {
        this.$router.push({
          path: '/',
          query: {
            'ingredients[ingredient][id]': ingredient.id,
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .v-card__title {
    word-break: keep-all;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
