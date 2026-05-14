import { inject, readonly, ref, type DeepReadonly, type InjectionKey, type Ref } from 'vue'
import type { Act, DirectorState } from '@/lib/director-types'
import { lastMoveAt } from '@/composables/useStillness'

export interface Clock {
  now(): number
  start(tick: (now: number) => void): () => void
}

export const realClock: Clock = {
  now: () => performance.now(),
  start(tick) {
    let raf = requestAnimationFrame(function loop(t) {
      tick(t)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
    }
  },
}

export interface VirtualClock extends Clock {
  advance(ms: number): void
  setNow(ms: number): void
}

export function createVirtualClock(initial = 0): VirtualClock {
  let nowMs = initial
  let onTick: ((now: number) => void) | null = null
  return {
    now: () => nowMs,
    start(tick) {
      onTick = tick
      tick(nowMs)
      return () => {
        onTick = null
      }
    },
    advance(ms: number) {
      nowMs += ms
      onTick?.(nowMs)
    },
    setNow(ms: number) {
      nowMs = ms
      onTick?.(nowMs)
    },
  }
}

export interface DirectorApi {
  state: DeepReadonly<Ref<DirectorState>>
  submitHate: (text: string) => void
  submitLove: (text: string) => void
  flagSafetyConcern: () => void
  pause: () => void
  resume: () => void
}

function createInitialState(): DirectorState {
  return {
    act: 'preflight',
    mood: 'playful',
    ritual: 'idle',
    sessionMs: 0,
    stillnessMs: 0,
    visitorTier: 'first',
    presenceCount: 1,
    lifetimeCount: 0,
    paused: false,
  }
}

const directorState = ref<DirectorState>(createInitialState())

let cachedApi: DirectorApi | null = null
let clockDispose: (() => void) | null = null
let startedAt = 0
let totalPausedMs = 0
let lastTickAt = 0

function evaluateTransitions(sessionMs: number, stillnessMs: number, currentAct: Act): void {
  if (currentAct === 'preflight' && sessionMs >= 800) {
    directorState.value.act = 'flirt'
    return
  }
  if (currentAct === 'flirt' && sessionMs >= 90_000) {
    directorState.value.act = 'settle'
    return
  }
  if (currentAct === 'settle' && (sessionMs >= 180_000 || stillnessMs >= 8_000)) {
    directorState.value.act = 'cathedral'
    return
  }
  if (currentAct === 'cathedral' && sessionMs >= 390_000 && stillnessMs >= 4_000) {
    directorState.value.act = 'invite'
    return
  }
  if (currentAct === 'held' && sessionMs >= 600_000) {
    directorState.value.act = 'secondCathedral'
    return
  }
  if (currentAct === 'secondCathedral' && sessionMs >= 690_000) {
    directorState.value.act = 'ending'
    return
  }
}

function applyTime(now: number): void {
  if (directorState.value.paused) {
    totalPausedMs += now - lastTickAt
    lastTickAt = now
    return
  }
  lastTickAt = now
  const sessionMs = now - startedAt - totalPausedMs
  const stillnessMs = Math.max(0, now - lastMoveAt.value)
  directorState.value.sessionMs = sessionMs
  directorState.value.stillnessMs = stillnessMs
  evaluateTransitions(sessionMs, stillnessMs, directorState.value.act)
}

function buildApi(): DirectorApi {
  return {
    state: readonly(directorState),
    submitHate: () => {
      throw new Error('useDirector.submitHate: not implemented')
    },
    submitLove: () => {
      throw new Error('useDirector.submitLove: not implemented')
    },
    flagSafetyConcern: () => {
      throw new Error('useDirector.flagSafetyConcern: not implemented')
    },
    pause: () => {
      directorState.value.paused = true
    },
    resume: () => {
      directorState.value.paused = false
    },
  }
}

export function useDirector(): DirectorApi {
  cachedApi ??= buildApi()
  return cachedApi
}

export function startDirector(clock: Clock = realClock): void {
  if (clockDispose) return
  startedAt = clock.now()
  lastTickAt = startedAt
  totalPausedMs = 0
  clockDispose = clock.start(applyTime)
}

export function stopDirector(): void {
  clockDispose?.()
  clockDispose = null
}

export const DIRECTOR_KEY: InjectionKey<DirectorApi> = Symbol('director')

export function injectDirector(): DirectorApi {
  const api = inject(DIRECTOR_KEY)
  if (!api) {
    throw new Error(
      'Director not provided. Call app.provide(DIRECTOR_KEY, useDirector()) in main.ts before mount.',
    )
  }
  return api
}

export function __resetDirectorStateForTests(): void {
  stopDirector()
  directorState.value = createInitialState()
  cachedApi = null
  startedAt = 0
  totalPausedMs = 0
  lastTickAt = 0
}

export function __setActForTests(act: Act, clock: Clock): void {
  directorState.value.act = act
  directorState.value.sessionMs = 0
  startedAt = clock.now()
  totalPausedMs = 0
  lastTickAt = startedAt
}
