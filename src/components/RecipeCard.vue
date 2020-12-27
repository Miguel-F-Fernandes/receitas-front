<template>
  <v-container>
    <v-card>
      <div class="d-flex flex-no-wrap justify-start">
        <v-avatar size="125">
          <v-img :src="recipe.image" :contain="true"></v-img>
        </v-avatar>

        <div>
          <v-card-title class="text-h5" v-text="recipe.name"></v-card-title>

          <v-row align="center" class="mx-0 pl-4 mb-2">
            <v-rating :value="recipe.hardness" :length="10" dense readonly>
              <template v-slot:item="props">
                <v-icon :color="props.isFilled ? 'brown' : 'grey lighten-1'" small>
                  mdi-glass-cocktail
                </v-icon>
              </template>
            </v-rating>
          </v-row>

          <v-row align="center" class="mx-0 pl-4">
            <v-rating :value="recipe.sweetness" :length="10" dense readonly>
              <template v-slot:item="props">
                <v-icon :color="props.isFilled ? 'pink lighten-2' : 'grey lighten-1'" small>
                  mdi-candy
                </v-icon>
              </template>
            </v-rating>
          </v-row>

          <v-card-subtitle v-text="recipe.description"></v-card-subtitle>
        </div>
      </div>
    </v-card>
  </v-container>

  <!--
  <v-card max-width="350">
    <v-img height="250" :contain="true" :src="recipe.image"></v-img>

    <v-card-title>{{ recipe.name }}</v-card-title>

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

      <div>{{ recipe.description }}</div>
    </v-card-text>
  </v-card>
  -->
</template>

<script>
  export default {
    props: ['recipe'],
  }
</script>

<style scoped lang="scss"></style>
