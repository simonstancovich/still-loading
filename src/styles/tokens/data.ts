export const tokens = {
  color: {
    ink: {
      base: '#2a2a28',
      faint: 'rgba(42, 42, 40, 0.33)',
      fainter: 'rgba(42, 42, 40, 0.20)',
    },
    bg: {
      base: '#f6f4ef',
    },
    glow: {
      warm: '#fff2d9',
      cool: '#d8e0e8',
    },
    bar: {
      dim: '#8c8c88',
      bright: '#fff2d9',
    },
    rupture: {
      black: '#000000',
      bloom: '#fff8e7',
    },
  },
  palette: {
    preflight: { base: '#ffffff', warm: '#ffffff', cool: '#f8f8f6', accent: '#000000' },
    flirt: { base: '#f6f4ef', warm: '#f8e7d4', cool: '#e8e9eb', accent: '#5b5b58' },
    settle: { base: '#f4f2ec', warm: '#f6e2c8', cool: '#e2e6ea', accent: '#7a6a52' },
    cathedral: { base: '#f0ece2', warm: '#f4d9b5', cool: '#d8dde1', accent: '#c0a07a' },
    invite: { base: '#eee9dd', warm: '#f0d5ad', cool: '#d4dadf', accent: '#a87a4d' },
    ritual: { base: '#ece6d8', warm: '#ecc99e', cool: '#c8d0d6', accent: '#9a6a3a' },
    held: { base: '#e8e0cc', warm: '#e9bd8e', cool: '#bdc6cd', accent: '#7e542a' },
    secondCathedral: { base: '#e6dcc5', warm: '#e6b380', cool: '#b3bcc4', accent: '#65411f' },
    ending: { base: '#e3d8be', warm: '#e3a872', cool: '#aab3bc', accent: '#4f3217' },
    longTail: { base: '#dfd2b4', warm: '#dfa066', cool: '#a0aab4', accent: '#3d2611' },
  },
  type: {
    handwriting: "'Caveat', cursive",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  },
  size: {
    body: '1rem',
    voice: '2rem',
    corner: '1rem',
  },
  space: {
    1: '0.25rem',
    2: '0.5rem',
    3: '1rem',
    4: '1.5rem',
    5: '2rem',
  },
  motion: {
    duration: {
      fast: '300ms',
      med: '900ms',
      slow: '3000ms',
      breath: '8000ms',
    },
    ease: {
      organic: 'cubic-bezier(0.4, 0, 0.2, 1)',
      gentle: 'cubic-bezier(0.65, 0, 0.35, 1)',
    },
  },
  z: {
    scene: '0',
    overlay: '10',
    voice: '20',
    ritual: '30',
    rupture: '40',
  },
} as const

export type Tokens = typeof tokens
