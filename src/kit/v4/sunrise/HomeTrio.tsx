import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'

export interface HomeTrioItem {
  /** ≤ 10 字. */
  name: string
  /** ≤ 18 字. */
  note?: string
  /** Which page sketch to draw. */
  variant: 'chart' | 'calendar' | 'dark'
}

export interface HomeTrioProps {
  kicker?: string
  /** 1 line ≤ 10 字. */
  title: Text
  /** Exactly 3 variants. */
  items: HomeTrioItem[]
  /** Index picked at the start. */
  picked?: number
  /** Chip on the picked card, ≤ 4 字. */
  pickedLabel?: string
  hint?: string
}

function Sketch({ variant }: { variant: HomeTrioItem['variant'] }) {
  return (
    <div className={`sr-sk is-${variant}`}>
      <div className="sr-sk__nav">
        <i />
        <i />
        <i />
      </div>
      <i className="h" />
      <i className="s" />
      <i className="b" />
      {variant === 'calendar' ? (
        <div className="sr-sk__cal">
          {Array.from({ length: 14 }, (_, k) => (
            <i key={k} className={k === 4 ? 'is-y' : k === 1 || k === 9 ? 'is-p' : ''} />
          ))}
        </div>
      ) : (
        <div className="sr-sk__chart">
          {[40, 70, 55, 90, 65, 80, 48].map((v, k) => (
            <i key={k} style={{ height: `${v}%` }} className={variant === 'dark' && k % 2 === 0 ? 'is-p' : ''} />
          ))}
        </div>
      )}
      <i />
      <i className="w7" />
      <div className="sr-sk__row">
        <i />
        <i />
        <i />
      </div>
      <i />
      <i className="w6" />
      <div className="sr-sk__quote">
        <span />
        <i />
        <i className="w7" />
      </div>
      <div className="sr-sk__price">
        <i />
        <i className="is-y" />
        <i />
      </div>
      <i className="s" />
      <div className="sr-sk__foot" />
    </div>
  )
}

/** Three ready-made homepages side by side; hover a card and its page scrolls, click to pick one. Made for `sunrise`, works in any style. */
export function HomeTrio({ kicker, title, items, picked = 0, pickedLabel, hint }: HomeTrioProps) {
  const [on, setOn] = useState(picked)
  return (
    <section className="slide">
      <Hint id="hometrio">{hint}</Hint>
      <div className="sr-sun is-soft" aria-hidden="true" />
      <div className="frame sr-homes">
        <div className="sr-center">
          {kicker && (
            <Reveal i={0} className="sr-kick">
              ◆ {kicker}
            </Reveal>
          )}
          <Reveal i={1}>
            <h2 className="sr-title">
              <Lines text={title} />
            </h2>
          </Reveal>
        </div>
        <div className="sr-homes__row" role="radiogroup">
          {items.slice(0, 3).map((it, i) => (
            <Reveal key={it.name} i={2 + i} y={40} className={`sr-gc${on === i ? ' is-on' : ''}`}>
              <button type="button" role="radio" aria-checked={on === i} onClick={() => setOn(i)}>
                <div className="sr-gc__sc" data-crop>
                  <Sketch variant={it.variant} />
                </div>
                <span className="sr-gc__cap">
                  <b>{it.name}</b>
                  {it.note && <small>{it.note}</small>}
                </span>
                {pickedLabel && <em className="sr-gc__chip">{pickedLabel}</em>}
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
