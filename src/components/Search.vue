<template>
  <v-container>
    <v-row v-if="$vuetify.breakpoint.smAndUp">
      <v-col class="d-flex align-center mb-2">
        <v-text-field
          :label="label"
          outlined
          dense
          v-model="search"
          hide-details="auto"
          :disabled="advancedSearchActive"
        ></v-text-field>
        <v-btn class="ml-3" elevation="2" color="primary" @click="toggleAdvancedSearch()">{{
          advancedSearchActive ? $i18n.t('search.button.simple') : $i18n.t('search.button.advanced')
        }}</v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-expand-transition>
        <v-col cols="12" v-if="!advancedSearchActive">
          <v-text-field
            :label="label"
            outlined
            dense
            v-model="search"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-expand-transition>

      <v-col class="pt-0">
        <v-btn block elevation="2" color="primary" @click="toggleAdvancedSearch()">{{
          advancedSearchActive ? $i18n.t('search.button.simple') : $i18n.t('search.button.advanced')
        }}</v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <div v-if="advancedSearchActive">
        <div v-for="(field, index) in advancedSearch" :key="index">
          <v-divider v-if="$vuetify.breakpoint.smAndDown" class="my-5"></v-divider>

          <v-row class="d-flex align-center">
            <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 4">
              <v-select
                v-model="field.field"
                :items="advancedFields"
                item-text="text"
                item-value="value"
                :label="$i18n.t('search.field')"
                single-line
                outlined
                dense
                hide-details="auto"
              ></v-select>
            </v-col>

            <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 3">
              <v-select
                v-model="field.op"
                :items="operations"
                item-text="text"
                item-value="value"
                :label="$i18n.t('search.operation')"
                single-line
                outlined
                dense
                hide-details="auto"
              ></v-select>
            </v-col>

            <v-col
              :cols="
                $vuetify.breakpoint.smAndDown
                  ? advancedSearch.length !== 1
                    ? 10
                    : 12
                  : advancedSearch.length !== 1
                  ? 4
                  : 5
              "
            >
              <v-text-field
                v-if="!field.op || field.op !== 'blank'"
                :label="$i18n.t('search.value')"
                outlined
                dense
                v-model="field.value"
                hide-details="auto"
              ></v-text-field>

              <v-select
                v-else
                v-model="field.value"
                :items="[
                  { text: $i18n.t('search.value-blank.true'), value: true },
                  { text: $i18n.t('search.value-blank.false'), value: false },
                ]"
                item-text="text"
                item-value="value"
                :label="$i18n.t('search.value')"
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
        </div>

        <v-row class="mt-5">
          <v-col class="pt-0">
            <v-btn block color="primary darken-2" @click="addField()">
              {{ $i18n.t('search.add-field') }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
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
      advancedSearch: [],
      operations: [
        { value: 'eq', text: 'equals' },
        { value: 'not_eq', text: 'not equal to' },
        { value: 'in', text: 'in' },
        { value: 'not_in', text: 'not in' },
        { value: 'contains', text: 'contains' },
        { value: 'not_contains', text: "doesn't contain" },
        { value: 'blank', text: 'is blank' },
        { value: 'gt', text: 'greater than' },
        { value: 'lt', text: 'less than' },
        { value: 'gt_or_eq', text: 'equal or greater than' },
        { value: 'lt_or_eq', text: 'equal or less than' },
      ],
      advancedFields: [],
    }),

    created() {
      // watch for changes to locale to update operations
      this.setOperationsLocale()
      this.$watch(() => this.$i18n.locale, this.setOperationsLocale)

      // watch for any changes to the url to update advancedSearch values
      this.$watch(
        () => this.$route.query,
        (to, from) => {
          if (JSON.stringify(from) === JSON.stringify(to)) return
          this.buildAdvancedSearchArray(to)
        }
      )

      this.buildAdvancedSearchArray(this.$route.query)
    },

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
          if (search.op === 'eq') {
            query[search.field] = search.value
          } else {
            query[`${search.field}[${search.op}]`] = search.value
          }
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

      buildAdvancedSearchArray(query) {
        let searchArray = []
        // update valus in advancedSearch according to route query values
        Object.keys(query).forEach(key => {
          // get last value between brackets
          let op = key.match(/([^[\]]*)(?=]$)/)
          if (op && this.operations.find(operation => operation.value === op[0])) {
            // check if it's a valid operation
            op = op[0]
          } else {
            // otherwise it's the equality operator
            op = 'eq'
          }
          // remove operation from key
          let newKey = key.replace(new RegExp(`${op}]$`), '').replace(/\[$/, '')
          searchArray.push({
            field: newKey,
            op: op,
            value: this.$route.query[key],
          })
        })

        this.advancedSearch = searchArray
        if (this.advancedSearch.length) {
          this.advancedSearchActive = true
        } else {
          this.advancedSearchActive = false
        }
      },

      setOperationsLocale() {
        this.operations.forEach(op => {
          op.text = this.$i18n.t(`search.operations.${op.value}`)
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .v-input__append-outer {
    margin: 0 !important;
  }
</style>
