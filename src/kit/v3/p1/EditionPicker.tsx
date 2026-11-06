import { Reveal } from '../../../deck/primitives'
import { Icon } from '../../Icon'
import type { IconName } from '../../icon-set'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface EditionOption {
  /** ≤ 12 个字符 or ≤ 8 字. */
  name: string
  icon?: IconName
  /** Small tag top-left, ≤ 6 字. */
  tag?: string
  /** ≤ 40 字. */
  desc: string
  /** “适合…” line, highlighted when selected, ≤ 24 字. */
  fit?: string
}

export interface EditionPickerProps extends SlideBase {
  /** 3–6 options (3 per row). With build: 'focus' each → moves the selection to the next card. */
  options: EditionOption[]
  /** Selected card when fully built. Default 0. */
  selected?: number
  /** Label before the fit line. Default '适合'. */
  fitLabel?: string
}

/** Radio-style option cards; the selection ring and check move from card to card with each build step. */
export function EditionPicker({ kicker, title, lead, options, selected = 0, fitLabel = '适合', source, hint }: EditionPickerProps) {
  return (
    <section className="slide">
      <Hint id="editionpicker">{hint}</Hint>
      <div className="frame d1-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className={`d1pick d1pick--${options.length > 3 ? 'two' : 'one'}`}>
          {options.map((o, i) => (
            <div key={i} className={`d1pick__card${i === selected ? ' is-open' : ''}`} data-build="">
              <div className="d1pick__top">
                {o.icon && (
                  <span className="d1pick__icon">
                    <Icon name={o.icon} size={34} />
                  </span>
                )}
                {o.tag && <span className="d1pick__tag">{o.tag}</span>}
                <span className="d1pick__radio" aria-hidden>
                  <Icon name="check" size={22} />
                </span>
              </div>
              <h3>{o.name}</h3>
              <p>{o.desc}</p>
              {o.fit && (
                <p className="d1pick__fit">
                  <b>{fitLabel}</b>
                  {o.fit}
                </p>
              )}
            </div>
          ))}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
