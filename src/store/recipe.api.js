import axios from 'axios'

export default {
  namespaced: true,
  state: {
    recipes: [],
  },
  mutations: {
    // synchronous
    set(state, recipes) {
      state.recipes = recipes
    },
  },
  actions: {
    // asynchronous
    async get(context) {
      let response = await axios.get('/recipes')
      context.commit('set', response.data)
    },
  },
  modules: {},
  getters: {},
}
