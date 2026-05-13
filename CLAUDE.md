# CLAUDE.md — still loading

Project context for Claude Code sessions. The full design intent lives in `SPEC.md` (local-only, gitignored) and `docs/superpowers/specs/` (also gitignored). Read those before doing meaningful work in this codebase.

## What this is

A contemplative interactive web piece, twelve minutes long. Four acts: flirt → settle → cathedral → ritual. A loading bar that never finishes.

## Stack

- Vue 3 (`<script setup>`, Composition API) + TypeScript strict + `noUncheckedIndexedAccess`
- Vite for build, Vitest for unit/component tests, Playwright for e2e
- Three.js for the WebGL scene, SVG for handwriting, DOM for inputs and corner text
- Tone.js for audio (Phase 1: recorded piano controller; Phase 3: conducted score)
- Supabase for backend (Postgres + Realtime presence + Edge Functions), provisioned via Vercel Marketplace
- Vercel for hosting
- pnpm for package management
- ESLint flat config with `strict-type-checked` + `stylistic-type-checked`
- Prettier handles formatting

## Architectural rule (non-negotiable)

**Composables only read from `useDirector`.** They never communicate with each other. The director is the only source of truth for "what's happening right now." See `src/composables/useDirector.ts` and `src/lib/director-types.ts`.

If you find yourself wiring two composables together, stop and route through the director instead.

## Three.js and Vue reactivity

Never put a Three.js instance (`WebGLRenderer`, `Scene`, `Mesh`, `Material`, `BufferGeometry`, layer classes that own them) into `ref()` or `reactive()`. Vue would recursively proxy every internal field — including 10,000-float vertex arrays that mutate every frame — and the piece's 16ms frame budget is gone. Three's internal `instanceof` checks can also break on proxied objects.

Use `src/scene/raw.ts`:

```ts
import { rawShallow, rawShallowNullable, assignRaw } from '@/scene/raw'

// Eagerly constructed
const renderer = rawShallow(new WebGLRenderer({ canvas }))

// Lazy / null-until-mounted
const scene = rawShallowNullable<Scene>()
onMounted(() => assignRaw(scene, new Scene()))
```

`shallowRef` keeps the slot itself reactive (you can swap renderers, watch for `null → instance`) without tracking the instance's internals. `markRaw` is the lock that prevents accidental re-proxying if the value ever passes through `reactive()` later.

Plain TS classes that own Three.js objects (the `*Layer.ts` files in `src/scene/layers/`) are already correct — they never live in refs.

## Conventions

- No comments by default. Identifiers should carry meaning. Add a comment only when the *why* is non-obvious.
- Typed token props for design tokens (not style objects), derived from `src/styles/tokens/`. Never use a raw color or size literal in component code — go through `tokens.*` or the `var(--*)` CSS variables, never `var(--x, #fallback)`.
- Tests at every layer: unit, component, integration, e2e. The director state machine in particular needs a deterministic clock and scripted-input harness — never test against the system clock.
- Conventional Commits (`chore:`, `feat:`, `fix:`, `docs:`, `test:`). No `Co-Authored-By` trailers.
- Branch + PR workflow for non-trivial changes. Don't push directly to `main` once the project has any history worth preserving.
- 9/10+ quality bar. Self-review the diff before pushing.
- Restraint over maximalism. When in doubt, cut.

## Phased delivery

Three phases per `SPEC.md` Section 13. Each phase produces a complete piece — the piece can ship after any phase. Phase 1 is the spine; Phase 2 is the cathedral; Phase 3 is the long tail and the real piano.

Current phase: **Phase 1**.

## Privacy posture

- Hate-text never leaves the client.
- Love-words go through Supabase Edge Function `submit-love.ts` and (in Phase 2+) LLM moderation.
- No analytics. No PII. No telemetry.
- Session hashes are SHA-256, used only for rate-limiting submissions.
