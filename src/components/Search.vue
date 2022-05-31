<template>
  <v-container>
    <v-row class="d-flex align-center mb-2">
      <v-text-field
        :label="label"
        outlined
        dense
        v-model="search"
        hide-details="auto"
        :disabled="advancedSearchActive"
      ></v-text-field>
      <v-btn class="ml-3" elevation="2" color="primary" @click="toggleAdvancedSearch()">{{
        advancedSearchActive ? searchTypeLabels.simple : searchTypeLabels.advanced
      }}</v-btn>
    </v-row>

    <div v-if="advancedSearchActive">
      <v-row class="d-flex align-center" v-for="(field, index) in advancedSearch" :key="index">
        <v-col cols="4">
          <v-select
            v-model="field.field"
            :items="advancedFields"
            item-text="text"
            item-value="value"
            label="Field"
            single-line
            outlined
            dense
            hide-details="auto"
          ></v-select>
        </v-col>

        <v-col cols="3">
          <v-select
            v-model="field.op"
            :items="operations"
            item-text="text"
            item-value="value"
            label="Operation"
            single-line
            outlined
            dense
            hide-details="auto"
          ></v-select>
        </v-col>

        <v-col cols="4">
          <v-text-field
            v-if="!field.op || field.op !== 'blank'"
            label="Value"
            outlined
            dense
            v-model="field.value"
            hide-details="auto"
          ></v-text-field>

          <v-select
            v-else
            v-model="field.value"
            :items="[
              { text: 'True', value: true },
              { text: 'False', value: false },
            ]"
            item-text="text"
            item-value="value"
            label="Value"
            single-line
            outlined
            dense
            hide-details="auto"
          ></v-select>
        </v-col>

        <v-btn
          v-if="advancedSearch.length !== 1"
          icon
          color="red darken-4"
          @click="removeField(index)"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </v-row>

      <v-row class="my-3">
        <v-btn block color="primary darken-2" @click="addField()">
          Add field
        </v-btn>
      </v-row>
    </div>
  </v-container>
</template>

<script>
  export default {
    props: ['label', 'fields'],

    data: () => ({
      search: null,
      debounceOptions: {
        delay: 500, // in milliseconds
        timeout: null,
      },
      advancedSearchActive: false,
      searchTypeLabels: {
        simple: 'Simple search',
        advanced: 'Advanced search',
      },
      advancedSearch: [],
      operations: [
        { value: 'contains', text: 'contains' },
        { value: 'not_contains', text: "doesn't contain" },
        { value: 'gt', text: 'greater than' },
        { value: 'lt', text: 'less than' },
        { value: 'gt_or_eq', text: 'equal or greater than' },
        { value: 'lt_or_eq', text: 'equal or less than' },
        { value: 'blank', text: 'is blank' },
        { value: 'eq', text: 'equal' },
        { value: 'not_eq', text: 'not equal' },
        { value: 'in', text: 'in' },
        { value: 'not_in', text: 'not in' },
      ],
      advancedFields: [],
    }),

    watch: {
      search() {
        this.debounce(this.update)()
      },

      advancedSearch: {
        deep: true,
        handler() {
          this.debounce(this.update)()
        },
      },

      fields(newValue) {
        let fields = []

        const pushFields = (obj, key, preffix) => {
          if (typeof obj[key] === 'string') {
            fields.push({
              value: preffix ? `${preffix}[${key}]` : key,
              text: obj[key],
            })
          } else if (typeof obj[key] === 'object') {
            Object.keys(obj[key]).forEach(subkey => {
              pushFields(obj[key], subkey, preffix ? `${preffix}[${key}]` : key)
            })
          }
        }

        Object.keys(newValue).forEach(key => {
          pushFields(newValue, key, undefined)
        })

        this.advancedFields = fields
      },
    },

    computed: {
      searchQuery() {
        // simple search
        if (!this.advancedSearchActive) {
          if (!this.search) return undefined
          return {
            'name[contains]': this.search,
          }
        }

        // advanced search
        let query = {}
        this.advancedSearch.forEach(search => {
          if (!search.field || !search.op || search.value === null) return
          query[`${search.field}[${search.op}]`] = search.value
        })

        if (!Object.keys(query).length) return undefined

        return query
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

      toggleAdvancedSearch() {
        this.advancedSearchActive = !this.advancedSearchActive
        if (!this.advancedSearch.length) {
          this.addField()
        }
      },

      addField() {
        this.advancedSearch.push({
          field: null,
          op: null,
          value: null,
        })
      },

      removeField(index) {
        this.advancedSearch.splice(index, 1)
      },
    },
  }
</script>

<style scoped lang="scss">
  .v-input__append-outer {
    margin: 0 !important;
  }
</style>
