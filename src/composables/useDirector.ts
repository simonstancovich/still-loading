import { inject, readonly, ref, type DeepReadonly, type InjectionKey, type Ref } from 'vue'
import type { Act, DirectorState, Mood, RitualState } from '@/lib/director-types'
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
  confirmPresence: () => void
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
    awaitingPresence: true,
  }
}

const directorState = ref<DirectorState>(createInitialState())

let cachedApi: DirectorApi | null = null
let clockDispose: (() => void) | null = null
let startedAt = 0
let totalPausedMs = 0
let lastTickAt = 0

const MOOD_BY_ACT: Readonly<Record<Act, Mood>> = {
  preflight: 'playful',
  flirt: 'playful',
  settle: 'honest',
  cathedral: 'reverent',
  invite: 'tender',
  ritual: 'tender',
  held: 'held',
  secondCathedral: 'reverent',
  ending: 'reverent',
  longTail: 'reverent',
}

function enterAct(act: Act): void {
  // Set mood before act: consumers may watch `act` with flush: 'sync' and
  // would otherwise observe a stale mood between these two assignments.
  directorState.value.mood = MOOD_BY_ACT[act]
  directorState.value.act = act
}

// Ritual hooks are registered by useRitual at module load. The director
// never imports useRitual directly — that would form an import cycle, since
// useRitual imports useDirector.
interface RitualHooks {
  submitHate: (text: string) => void
  submitLove: (text: string) => void
}
let ritualHooks: RitualHooks | null = null
let ritualStateGetter: (() => RitualState) | null = null

export function __registerRitualHooks(hooks: RitualHooks): void {
  ritualHooks = hooks
}

export function __registerRitualStateGetter(getter: () => RitualState): void {
  ritualStateGetter = getter
}

// Measured from the moment the user confirms presence. The bar fades in
// (over motion-duration-slow), then the voice greeting arrives when flirt
// begins. The "are you here?" prompt is the deliberate pause — once the
// user clicks, the piece unfolds smoothly without further synthetic delay.
export const PREFLIGHT_MS = 4_000

function evaluateTransitions(sessionMs: number, stillnessMs: number, currentAct: Act): void {
  if (currentAct === 'preflight' && sessionMs >= PREFLIGHT_MS) {
    enterAct('flirt')
    return
  }
  if (currentAct === 'flirt' && sessionMs >= 90_000) {
    enterAct('settle')
    return
  }
  if (currentAct === 'settle' && (sessionMs >= 180_000 || stillnessMs >= 8_000)) {
    enterAct('cathedral')
    return
  }
  if (currentAct === 'cathedral' && sessionMs >= 390_000 && stillnessMs >= 4_000) {
    enterAct('invite')
    return
  }
  if (currentAct === 'invite' && ritualStateGetter && ritualStateGetter() !== 'idle') {
    enterAct('ritual')
    return
  }
  if (currentAct === 'ritual' && ritualStateGetter && ritualStateGetter() === 'resolved') {
    enterAct('held')
    return
  }
  if (currentAct === 'held' && sessionMs >= 600_000) {
    enterAct('secondCathedral')
    return
  }
  if (currentAct === 'secondCathedral' && sessionMs >= 690_000) {
    enterAct('ending')
    return
  }
  if (currentAct === 'ending' && sessionMs >= 720_000) {
    enterAct('longTail')
    return
  }
}

function applyTime(now: number): void {
  // sessionMs does not advance while paused (active runtime pause) or while
  // awaiting presence (before the user has clicked to begin the piece).
  if (directorState.value.paused || directorState.value.awaitingPresence) {
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
    submitHate: (text: string) => {
      ritualHooks?.submitHate(text)
    },
    submitLove: (text: string) => {
      ritualHooks?.submitLove(text)
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
    confirmPresence: () => {
      directorState.value.awaitingPresence = false
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
  // Tests run in the post-presence runtime by default — the gate is
  // exercised in dedicated tests that explicitly set this back to true.
  directorState.value.awaitingPresence = false
  cachedApi = null
  startedAt = 0
  totalPausedMs = 0
  lastTickAt = 0
}

export function __setAwaitingPresenceForTests(value: boolean): void {
  directorState.value.awaitingPresence = value
}

export function __setActForTests(act: Act, clock: Clock): void {
  enterAct(act)
  directorState.value.sessionMs = 0
  directorState.value.awaitingPresence = false
  startedAt = clock.now()
  totalPausedMs = 0
  lastTickAt = startedAt
}
