<template>
  <v-card width="260">
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

          <div class="font-weight-light">{{ ingredient._count.recipes }} receitas</div>
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
    },
  }
</script>

<style scoped lang="scss">
  .v-card__title {
    word-break: keep-all;
  }
</style>
