export interface SafetyResource {
  region: string
  label: string
  contact: string
}

export const tier1HeavyPatterns: readonly RegExp[] = [
  /\bkill (myself|me)\b/i,
  /\b(i\s+)?want to die\b/i,
  /\bsuicid(e|al)\b/i,
  /\bend (it|my life|myself)\b/i,
]

export const tier2ConcerningPatterns: readonly RegExp[] = [
  /\bworthless\b/i,
  /\bno point\b/i,
  /\bhopeless\b/i,
]

export const resources: readonly SafetyResource[] = [
  { region: 'SE', label: '1177', contact: '1177' },
  { region: 'US', label: '988', contact: '988' },
  { region: 'UK', label: 'Samaritans', contact: '116 123' },
  { region: 'INT', label: 'samaritans.org', contact: 'samaritans.org' },
]

export interface SafetyHit {
  tier: 1 | 2
  match: string
}

export function checkSafety(_text: string): SafetyHit | null {
  throw new Error('checkSafety: not implemented')
}

export function pickResource(_region: string): SafetyResource {
  throw new Error('pickResource: not implemented')
}
