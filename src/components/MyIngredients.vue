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
      label="Search ingredients to add to cabinet"
      placeholder="Start typing to search"
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
        min-width="350"
        class="mx-auto mb-5 pa-3"
        elevation="2"
      ></v-skeleton-loader>

      <!-- TODO trocar por card só com nome e com botao pra remover -->
      <IngredientCard
        v-for="ingredient in allIngredients"
        :key="ingredient.id"
        :ingredient="ingredient"
        class="mx-auto mb-5"
      ></IngredientCard>
    </div>

    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </div>
</template>

<script>
  import IngredientCard from '@/components/IngredientCard.vue'

  export default {
    components: {
      IngredientCard,
    },

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
    },
  }
</script>

<style scoped lang="scss"></style>
