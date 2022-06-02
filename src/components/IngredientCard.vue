<template>
  <v-card width="260" class="d-flex flex-column justify-space-between">
    <v-card-title>{{ ingredient.name }}</v-card-title>
    <div class="d-flex flex-no-wrap justify-start">
      <div>
        <v-card-text>
          <v-row align="center" class="mx-0 mb-4">
            <v-rating :value="ingredient.price / 50" :length="10" dense readonly>
              <template v-slot:item="props">
                <v-icon :color="props.isFilled ? 'green darken-3' : 'grey lighten-1'" small>
                  mdi-currency-usd
                </v-icon>
              </template>
            </v-rating>
          </v-row>

          <div class="font-weight-light cursor-pointer" @click="goToRecipes()">
            {{ ingredient._count.recipes }} {{ $i18n.t('ingredient-card.recipe')
            }}{{ ingredient._count.recipes > 1 ? 's' : '' }}
          </div>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>
<script>
  export default {
    props: ['ingredient'],

    methods: {
      truncate(text) {
        const limit = 100
        if (!text || text.length <= limit) return text

        return text.slice(0, limit) + '...'
      },

      goToRecipes() {
        this.$router.push({
          path: '/',
          query: {
            'ingredients[ingredient][id]': this.ingredient.id,
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
