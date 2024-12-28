import './assets/main.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import store from './store'

import en from '../src/locales/en'
import sk from '../src/locales/sk'
import de from '../src/locales/de'
import es from '../src/locales/es'

const getDefaultLocale = () => {
  const storedLocale = localStorage.getItem('locale')
  const browserLocale = navigator.language.split('-')[0]
  return storedLocale || browserLocale || 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    en: en,
    sk: sk,
    de: de,
    es: es,
  },
})

import AOS from 'aos'
import 'aos/dist/aos.css'

import { db } from './firebase'

const app = createApp(App)

window.addEventListener('load', function () {
  AOS.init()
})

app.use(i18n)
app.use(router)
app.use(store)
app.provide('db', db)

store.dispatch('fetchUser').then(() => {
  app.mount('#app')
})
