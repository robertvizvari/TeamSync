import { createStore } from 'vuex'
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth'

const store = createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearUser(state) {
      state.user = null
      localStorage.removeItem('user')
    },
  },
  actions: {
    fetchUser({ commit }) {
      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const { displayName, email, uid } = user
          const [name, surname] = displayName ? displayName.split(' ') : ['', '']
          const userData = { name, surname, email, uid }
          commit('setUser', userData)
        } else {
          commit('clearUser')
        }
      })
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user
    },
    getUser(state) {
      return state.user
    },
  },
})

export default store
