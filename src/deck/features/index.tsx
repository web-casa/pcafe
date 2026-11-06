// Phase 5 presenter features, one file per feature so they can be built in
// parallel. Deck.tsx only renders <DeckFeatures> and spreads frameMotion().
//   presenter.tsx  — presenter view + PDF/print   (S key, #/presenter, #/print)
//   screen.tsx     — black / white screen, freeze (B, W, H keys)
//   help.tsx       — key list overlay             (? key)
//   ink.tsx        — laser pointer and pen        (L, D, C keys)
//   zoom.tsx       — magnify part of the slide    (Z key)
//   texture.tsx    — film texture overlay         (DeckDef.texture)
//   transition.ts  — slide hand-over motion       (DeckDef.transition)
//   backdrop.tsx   — layer behind slide content  (DeckDef/SlideDef.backdrop)
//   (char reveal lives in src/kit/p5, it is a template-level effect)

import { useEffect } from 'react'
import type { SlideDef } from '../Deck'
import { PresenterSync } from './presenter'
import { ScreenLayer, useScreen } from './screen'
import { DECK_KEYS, KeyHelp } from './help'
import { Ink } from './ink'
import { Zoom } from './zoom'
import { TextureLayer, type Texture } from './texture'

export { frameMotion, type Transition } from './transition'
export type { Texture }
export { BackdropLayer, type Backdrop } from './backdrop'

export interface FeatureProps {
  title: string
  slides: SlideDef[]
  index: number
  /** Build items shown on the current slide; null = fully built. */
  step: number | null
  builds: number
  texture: Texture
  /** True while the overview grid is open: features should stay out of the way. */
  overview: boolean
  go: (i: number) => void
  /** Called with true while the audience screen is blanked or frozen (autoplay pauses). */
  onHold?: (held: boolean) => void
}

export function DeckFeatures(p: FeatureProps) {
  const screen = useScreen(p)
  const held = screen.blank !== null || screen.frozen !== null
  const { onHold } = p
  useEffect(() => onHold?.(held), [held, onHold])
  return (
    <>
      <TextureLayer texture={p.texture} />
      <PresenterSync {...p} screen={screen} />
      <Ink overview={p.overview} index={p.index} />
      <Zoom overview={p.overview} index={p.index} />
      <ScreenLayer blank={screen.blank} frozen={screen.frozen} />
      <KeyHelp groups={DECK_KEYS} disabled={p.overview} />
    </>
  )
}
