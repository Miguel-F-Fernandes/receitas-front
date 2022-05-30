import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import AuthAPI from './auth.api'
import FeedbackAPI from './feedback.api'
import RecipeAPI from './recipe.api'
import IngredientAPI from './ingredient.api'
import MyIngredientAPI from './my-ingredient.api'

export default new Vuex.Store({
  state: {},
  mutations: {
    // synchronous
  },
  actions: {
    // asynchronous
  },
  modules: {
    auth: AuthAPI,
    feedback: FeedbackAPI,
    recipe: RecipeAPI,
    ingredient: IngredientAPI,
    'my-ingredient': MyIngredientAPI,
  },
})
