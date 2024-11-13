import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import AOS from 'aos'
import 'aos/dist/aos.css'

import { db } from './firebase'

const app = createApp(App)

window.addEventListener('load', function () {
  AOS.init()
})

app.use(router)
app.use(store)
app.provide('db', db)

store.dispatch('fetchUser').then(() => {
  app.mount('#app')
})
