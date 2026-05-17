import { color } from '@/styles/tokens/color'
import { motion } from '@/styles/tokens/motion'
import { size } from '@/styles/tokens/size'
import { space } from '@/styles/tokens/space'
import { typography } from '@/styles/tokens/typography'
import { z } from '@/styles/tokens/z'

export const tokens = {
  color,
  type: typography,
  size,
  space,
  motion,
  z,
} as const

export type Tokens = typeof tokens
