// Public engine surface for third-party packages. Pro code imports only from
// 'pcafe'; anything missing here is a contract change, not a local import.

export * from '../kit'
export { Hint, SlideFoot, plain, vars } from '../kit/shared'
export { useDeck } from '../deck/context'
export { useUnit } from '../deck/Stage'
export { EASE_OUT, MORPH, pad2 } from '../deck/motion'
export { usePointerDrift, type Drift } from '../deck/primitives'
export { STYLES, toneOf, registerStyle, type DeckStyle, type Paper, type SlideTone, type StylePreset } from '../kit/theme'
