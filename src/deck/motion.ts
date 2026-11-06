import type { Transition } from 'motion/react'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const MORPH: Transition = { type: 'spring', visualDuration: 0.56, bounce: 0.14 }

export const pad2 = (n: number) => String(n).padStart(2, '0')
