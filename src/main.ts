import { createApp } from 'vue'
import App from './App.vue'
import { DIRECTOR_KEY, useDirector } from '@/composables/useDirector'
import { applyTokensAsCssVariables } from '@/styles/apply'

import './styles/reset.css'
import './styles/fonts.css'

applyTokensAsCssVariables()

const app = createApp(App)
app.provide(DIRECTOR_KEY, useDirector())
app.mount('#app')
