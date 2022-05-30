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
    async get(context, params) {
      let response = await axios.get('/recipes', { params })
      context.commit('set', response.data)
      return response.data
    },
  },
  modules: {},
  getters: {},
}
