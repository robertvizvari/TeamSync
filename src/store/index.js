import { createStore } from 'vuex'
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore' // Import doc and getDoc from Firestore
import { db } from '@/firebase' // Import the Firestore DB instance

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
    updateUser(state, updatedData) {
      state.user = { ...state.user, ...updatedData }
      localStorage.setItem('user', JSON.stringify(state.user))
    },
  },
  actions: {
    async fetchUser({ commit, state }) {
      const auth = getAuth()
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const { displayName, email, uid } = user
          const [name, surname] = displayName ? displayName.split(' ') : ['', '']

          // Fetch additional user data (including profile picture) from Firestore
          const userDocRef = doc(db, 'users', uid) // Get the user document reference
          const userDocSnap = await getDoc(userDocRef) // Fetch the document snapshot

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data()

            const userProfileData = {
              name: userData.name || name,
              surname: userData.surname || surname,
              email,
              uid,
              profilePicture: userData.profilePicture || '', // Fetch profile picture from Firestore
            }
            commit('setUser', userProfileData)
          } else {
            console.error('User profile not found in Firestore')
            commit('clearUser')
          }
        } else {
          commit('clearUser')
        }
      })
    },

    async updateUserProfile({ commit, state }, { name, surname, profilePicture }) {
      const auth = getAuth()
      const user = auth.currentUser

      try {
        await updateProfile(user, { displayName: `${name} ${surname}` })

        const updatedData = { name, surname, profilePicture }
        commit('updateUser', updatedData)
      } catch (error) {
        console.error('Failed to update user profile:', error)
      }
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
