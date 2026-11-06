import type { ReactNode } from 'react'
import { Reveal } from '../deck/primitives'
import { type IconName } from './Icon'
import { IconTile, Pill, type Spot } from './parts'
import { Hint, Lines, type Text } from './shared'

export interface HangingCoverProps {
  /** Small tag above the title: a word in the solid chip, then ≤ 16 CJK characters. */
  tag?: { label: string; text: string }
  /** ≤ 2 lines × 12 CJK characters. */
  title: Text
  /** Substring of the title set in the accent colour. */
  mark?: string
  /** ≤ 50 CJK characters. */
  lead: string
  /** 4–8 icons hanging from the top edge on thin threads, left and right of the title. */
  icons: IconName[]
  /** 1–3 pills under the lead: facts about the talk (pages, date, speaker), not fake buttons. */
  pills?: string[]
  hint?: ReactNode
}

// Thread length (u) and x position (% of frame) for up to 8 hanging tiles, alternating sides.
const SLOTS = [
  { x: 9, len: 300, spot: 3, tilt: -8 },
  { x: 90, len: 380, spot: 1, tilt: 6 },
  { x: 20, len: 120, spot: 6, tilt: 4 },
  { x: 79, len: 150, spot: 2, tilt: -6 },
  { x: 4, len: 520, spot: 2, tilt: 10 },
  { x: 95, len: 560, spot: 4, tilt: -10 },
  { x: 29, len: 40, spot: 5, tilt: -4 },
  { x: 70, len: 60, spot: 3, tilt: 8 },
] as const

/** A product cover: centred headline, coloured icon tiles hanging from the top edge on thin threads. */
export function HangingCover({ tag, title, mark, lead, icons, pills = [], hint }: HangingCoverProps) {
  const lines = typeof title === 'string' ? [title] : title
  return (
    <section className="slide">
      <Hint id="hang">{hint}</Hint>
      <div className="frame s-hang">
        <div className="hang__threads" aria-hidden>
          {icons.slice(0, 8).map((icon, i) => {
            const s = SLOTS[i]
            return (
              <span key={i} className="hang__item" style={{ left: `${s.x}%`, ['--len' as string]: s.len, ['--tilt' as string]: `${s.tilt}deg`, ['--k' as string]: i }}>
                <i className="hang__thread" />
                <IconTile icon={icon} spot={s.spot as Spot} size={76} />
              </span>
            )
          })}
        </div>
        <div className="hang__copy">
          {tag && (
            <Reveal i={0} className="hang__tag">
              <Pill tone="accent">{tag.label}</Pill>
              <span>{tag.text}</span>
            </Reveal>
          )}
          <Reveal i={1}>
            <h1 className="hang__title cover__title">
              {lines.map((l, i) => {
                const at = mark ? l.indexOf(mark) : -1
                return (
                  <span key={i}>
                    {at < 0 ? (
                      l
                    ) : (
                      <>
                        {l.slice(0, at)}
                        <em>{mark}</em>
                        {l.slice(at + mark!.length)}
                      </>
                    )}
                  </span>
                )
              })}
            </h1>
          </Reveal>
          <Reveal i={2} className="hang__lead">
            <Lines text={lead} />
          </Reveal>
          {pills.length > 0 && (
            <Reveal i={3} className="hang__pills">
              {pills.map((p, i) => (
                <Pill key={p} tone={i === 0 ? 'solid' : 'soft'}>
                  {p}
                </Pill>
              ))}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
