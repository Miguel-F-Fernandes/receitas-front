import axios from 'axios'
import * as Sentry from '@sentry/vue'

const parseJwt = token => {
  try {
    return JSON.parse(
      decodeURIComponent(
        atob(token.split('.')[1])
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join('')
      )
    )
  } catch (e) {
    return null
  }
}

export default {
  namespaced: true,
  state: {
    token: null,
    decodedToken: null,
  },
  mutations: {
    // synchronous
    setToken(state, token) {
      state.token = token
      let jwt = parseJwt(token)
      if (jwt) {
        state.decodedToken = jwt
        Sentry.setUser({ id: jwt.id })
      }
    },
    unsetToken(state) {
      state.token = null
      state.decodedToken = null
    },
    checkToken(state) {
      let token = localStorage.getItem('token')
      if ('token' in localStorage && token !== undefined && token !== null) {
        state.token = token
        state.decodedToken = parseJwt(token)
      }
    },
  },
  actions: {
    // asynchronous
    async login(context, { email, password }) {
      let response = await axios.post('/auth/login', { email, password })
      localStorage.setItem('token', response.data.token)
      context.commit('setToken', response.data.token)
    },
    async logout(context) {
      await axios.post('/auth/logout')
      localStorage.removeItem('token')
      context.commit('unsetToken')
    },
    async register(context, { name, email, password }) {
      let response = await axios
        .post('/auth/register', {
          name,
          email,
          password,
        })
        .then(() => {
          return context.dispatch('login', {
            email,
            password,
          })
        })
    },
  },
  modules: {},
  getters: {
    isAuthenticated: state => {
      return state.token !== null && state.token !== undefined
    },
  },
}
