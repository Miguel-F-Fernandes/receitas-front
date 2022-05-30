<template>
  <v-card width="400">
    <v-card-title>{{ recipe.name }}</v-card-title>
    <div class="d-flex flex-no-wrap justify-start">
      <v-avatar size="125">
        <v-img :src="recipe.image" :contain="true"></v-img>
      </v-avatar>
      <div>
        <v-card-text>
          <v-row align="center" class="mx-0 mb-4">
            <v-rating :value="recipe.hardness" :length="10" dense readonly>
              <template v-slot:item="props">
                <v-icon :color="props.isFilled ? 'brown' : 'grey lighten-1'" small>
                  mdi-glass-cocktail
                </v-icon>
              </template>
            </v-rating>
          </v-row>

          <v-row align="center" class="mx-0 mb-4">
            <v-rating :value="recipe.sweetness" :length="10" dense readonly>
              <template v-slot:item="props">
                <v-icon :color="props.isFilled ? 'pink lighten-2' : 'grey lighten-1'" small>
                  mdi-candy
                </v-icon>
              </template>
            </v-rating>
          </v-row>

          <div class="font-weight-light">{{ truncate(recipe.description) }}</div>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>
<script>
  export default {
    props: ['recipe'],

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
