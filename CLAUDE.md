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

## Conventions

- No comments by default. Identifiers should carry meaning. Add a comment only when the *why* is non-obvious.
- Typed token props for design tokens (not style objects), derived from `src/styles/tokens.css` or a tokens module.
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
