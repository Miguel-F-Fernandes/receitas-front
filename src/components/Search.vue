<template>
  <v-container>
    <v-text-field :label="label" outlined v-model="search"></v-text-field>
  </v-container>
</template>

<script>
  export default {
    props: ['label'],

    data: () => ({
      search: null,
      debounceOptions: {
        delay: 500, // in milliseconds
        timeout: null,
      },
    }),

    watch: {
      search() {
        this.debounce(this.update)()
      },
    },

    computed: {
      searchQuery() {
        if (!this.search) return undefined
        return {
          'name[contains]': this.search,
        }
      },
    },

    methods: {
      update() {
        this.$emit('update', this.searchQuery)
      },

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
    },
  }
</script>

<style scoped lang="scss"></style>
