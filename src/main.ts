import { createApp } from 'vue'
import App from './App.vue'
import { applyTokensAsCssVariables } from '@/styles/apply'

import './styles/reset.css'
import './styles/fonts.css'

applyTokensAsCssVariables()

const app = createApp(App)
app.mount('#app')
