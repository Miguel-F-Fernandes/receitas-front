import axios from 'axios'

export default {
  namespaced: true,
  state: {},
  mutations: {
    // synchronous
  },
  actions: {
    // asynchronous
    async submit(context, { text }) {
      let response = await axios.post('/feedback', { text })
    },
  },
  modules: {},
  getters: {},
}
