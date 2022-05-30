import axios from 'axios'

export default {
  namespaced: true,
  state: {
    ingredients: [],
  },
  mutations: {
    // synchronous
    set(state, ingredients) {
      state.ingredients = ingredients
    },
  },
  actions: {
    // asynchronous
    async get(context, params) {
      let response = await axios.get('/my-ingredients', { params })
      context.commit('set', response.data)
      return response.data
    },
  },
  modules: {},
  getters: {},
}
