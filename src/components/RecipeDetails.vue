<template>
  <v-container>
    <div v-if="loading">{{ $i18n.t('recipe-details.loading') }}...</div>

    <div v-else>
      <div
        class="d-flex flex-no-wrap justify-start"
        :class="$vuetify.breakpoint.mdAndDown ? 'flex-column' : ''"
      >
        <p v-if="$vuetify.breakpoint.mdAndDown" class="text-h3 font-weight-light">
          {{ recipe.name }}
        </p>
        <v-img
          :class="$vuetify.breakpoint.mdAndDown ? 'align-self-center' : ''"
          height="300"
          width="300"
          :src="recipe.image"
          :contain="true"
        ></v-img>

        <div class="d-flex flex-column">
          <p v-if="$vuetify.breakpoint.mdAndUp" class="text-h2">{{ recipe.name }}</p>

          <div :class="$vuetify.breakpoint.mdAndDown ? 'align-self-start' : ''">
            <v-row class="mx-0 my-4">
              <v-rating :value="recipe.hardness" :length="10" dense readonly class="ml-auto">
                <template v-slot:item="props">
                  <v-icon :color="props.isFilled ? 'brown' : 'grey lighten-1'">
                    mdi-glass-cocktail
                  </v-icon>
                </template>
              </v-rating>
            </v-row>

            <v-row class="mx-0 my-4">
              <v-rating :value="recipe.sweetness" :length="10" dense readonly class="ml-auto">
                <template v-slot:item="props">
                  <v-icon :color="props.isFilled ? 'pink lighten-2' : 'grey lighten-1'">
                    mdi-candy
                  </v-icon>
                </template>
              </v-rating>
            </v-row>
          </div>

          <p class="text-body-2 text-justify">{{ recipe.description }}</p>
        </div>
      </div>

      <v-divider></v-divider>

      <v-card class="grey lighten-3">
        <v-card-subtitle
          >{{ $i18n.t('recipe-details.serve-in') }}:
          <span class="font-weight-bold">{{ recipe.serve_in }}</span></v-card-subtitle
        >

        <v-divider></v-divider>

        <v-card-text>
          <v-btn-toggle
            v-model="amountType"
            mandatory
            dense
            :style="$vuetify.breakpoint.mdAndUp ? 'float: right;' : ''"
          >
            <v-btn v-for="type in amountTypes" :key="type" :value="type">
              {{ type }}
            </v-btn>
          </v-btn-toggle>

          <v-list dense class="grey lighten-3">
            <v-list-item v-for="(ingredient, index) in recipe.ingredients" :key="index">
              <v-list-item-action>
                <v-list-item-action-text style="width: 75px;">
                  {{ ingredient.amount[amountType] }}
                </v-list-item-action-text>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title class="font-weight-regular ingredient">{{
                  ingredient.ingredient.name
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="font-weight-medium">
          {{ recipe.steps }}
        </v-card-text>
      </v-card>

      <div class="d-flex justify-space-between">
        <v-card-subtitle
          >{{ $i18n.t('recipe-details.alcohol-content') }}
          <span class="font-weight-medium">{{ recipe.alcohol_content }}%</span></v-card-subtitle
        >

        <v-card-subtitle
          >{{ $i18n.t('recipe-details.calories') }}:
          <span class="font-weight-bold">{{ recipe.calories }}</span></v-card-subtitle
        >
      </div>
    </div>
  </v-container>
</template>
<script>
  export default {
    data: () => ({
      recipe: null,
      loading: true,
      amountType: 'ml',
      amountTypes: [],
    }),

    created() {
      this.fetchRecipe(this.$route.params.id)
      this.$watch(
        () => this.$route.params,
        to => {
          this.fetchRecipe(to.id)
        }
      )
    },

    methods: {
      fetchRecipe: async function(id) {
        this.loading = true
        try {
          this.recipe = await this.$store.dispatch('recipe/getById', {
            id,
          })
          this.amountTypes = Object.keys(this.recipe.ingredients[0].amount)
        } catch (err) {
          this.$router.push({
            name: 'RecipeList',
          })
        }
        this.loading = false
      },
    },
  }
</script>

<style scoped lang="scss">
  p,
  .v-card__title {
    word-break: keep-all;
  }
  .ingredient {
    white-space: initial;
  }
</style>
