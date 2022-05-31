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
    async getFields(context) {
      let response = await axios.get('/recipes/fields')
      return response.data
    },
    async getById(context, { id }) {
      let response = await axios.get('/recipes', { params: { id } })
      return response.data && response.data.length ? response.data[0] : null
    },
  },
  modules: {},
  getters: {},
}
