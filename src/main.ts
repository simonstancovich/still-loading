import { createApp } from 'vue'
import App from './App.vue'
import { DIRECTOR_KEY, realClock, startDirector, useDirector } from '@/composables/useDirector'
import { startStillnessTracking } from '@/composables/useStillness'
import { startVoice } from '@/composables/useVoice'
import { startBar } from '@/composables/useBar'
import { startDust } from '@/composables/useDust'
import { startPainting } from '@/composables/usePainting'
import { startRitual } from '@/composables/useRitual'
import { wireVisibilityToDirector } from '@/main-wiring'
import { applyTokensAsCssVariables } from '@/styles/apply'

import './styles/reset.css'
import './styles/fonts.css'

applyTokensAsCssVariables()

const director = useDirector()
const app = createApp(App)
app.provide(DIRECTOR_KEY, director)
app.mount('#app')
startDirector(realClock)
startStillnessTracking(realClock)
startVoice()
startBar()
startDust()
startPainting()
startRitual()
wireVisibilityToDirector(director)
