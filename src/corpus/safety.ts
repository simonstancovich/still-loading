// ─────────────────────────────────────────────────────────────────────────────
// DRAFT — REVIEW BEFORE PUBLIC LAUNCH
// The crisis-branch copy and the resource list below are a working draft.
// Per SPEC.md Section 9 + Section 16, the exact wording shown to a viewer in
// distress must be reviewed by Simon before the piece ships publicly.
// ─────────────────────────────────────────────────────────────────────────────

export interface SafetyResource {
  region: string
  label: string
  contact: string
}

export const tier1HeavyPatterns: readonly RegExp[] = [
  /\bkill(ing)?\s+(myself|me)\b/i,
  /\b(i\s+)?want(ing)?\s+to\s+die\b/i,
  /\bsuicid(e|al)\b/i,
  /\bend(ing)?\s+(it|my\s+life|myself)\b/i,
  /\bdon'?t\s+want\s+to\s+(be\s+here|live|exist)\b/i,
]

export const tier2ConcerningPatterns: readonly RegExp[] = [
  /\bworthless\b/i,
  /\bno\s+point\b/i,
  /\bhopeless\b/i,
  /\bhate\s+myself\b/i,
]

export const resources: readonly SafetyResource[] = [
  { region: 'SE', label: '1177 Vårdguiden', contact: '1177' },
  { region: 'US', label: '988 Suicide & Crisis Lifeline', contact: '988' },
  { region: 'UK', label: 'Samaritans', contact: '116 123' },
  { region: 'INT', label: 'Find a helpline', contact: 'findahelpline.com' },
]

export interface SafetyHit {
  tier: 1 | 2
  match: string
}

export function checkSafety(text: string): SafetyHit | null {
  for (const pattern of tier1HeavyPatterns) {
    const m = pattern.exec(text)
    if (m) return { tier: 1, match: m[0] }
  }
  for (const pattern of tier2ConcerningPatterns) {
    const m = pattern.exec(text)
    if (m) return { tier: 2, match: m[0] }
  }
  return null
}

export function pickResource(region: string): SafetyResource {
  const found = resources.find((r) => r.region === region)
  if (found) return found
  const fallback = resources.find((r) => r.region === 'INT')
  if (!fallback) throw new Error('safety: missing INT fallback resource')
  return fallback
}
