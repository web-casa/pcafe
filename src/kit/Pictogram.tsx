import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, Lines, SlideFoot, vars, type SlideBase, type Text } from './shared'
import { Kicker } from '../deck/primitives'

export interface PictoPart {
  /** ≤ 10 CJK characters. */
  label: string
  /** Cells this part fills. */
  value: number
}

export interface PictogramProps extends Omit<SlideBase, 'title'> {
  /** The claim, ≤ 2 lines × 12 CJK characters. */
  title: Text
  /** 10 cells in one row (big icons) or 100 in a 10×10 grid. */
  of: 10 | 100
  /** 1–3 parts, filled in order from the first cell; their sum ≤ `of`. The first is the accent. */
  parts: PictoPart[]
  /** Label for the unfilled cells, ≤ 10 CJK characters. */
  rest?: string
  /** Icon for each cell; plain rounded squares when left out. */
  icon?: IconName
}

/** “3 in 10” as cells: a claim on the left, 10 or 100 icons on the right with the share filled. */
export function Pictogram({ kicker, title, lead, source, hint, of, parts, rest, icon }: PictogramProps) {
  const used = parts.reduce((n, p) => n + p.value, 0)
  const owner = (c: number) => {
    let at = 0
    for (let k = 0; k < parts.length; k++) {
      at += parts[k].value
      if (c < at) return k
    }
    return -1
  }
  return (
    <section className="slide">
      <Hint id="picto">{hint}</Hint>
      <div className="frame s-picto">
        <div className="picto__copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title picto__title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2} className="s-lead picto__lead">
              {lead}
            </Reveal>
          )}
          <ul className="picto__legend">
            {parts.map((p, k) => (
              <Reveal key={p.label} build i={3 + k * 0.5} className={`picto__key picto__key--${k}`}>
                <i />
                <span>{p.label}</span>
                <b>
                  {p.value}
                  <small> / {of}</small>
                </b>
              </Reveal>
            ))}
            {rest && (
              <Reveal i={5} className="picto__key picto__key--rest">
                <i />
                <span>{rest}</span>
                <b>
                  {of - used}
                  <small> / {of}</small>
                </b>
              </Reveal>
            )}
          </ul>
          <SlideFoot source={source} i={8} />
        </div>
        <Reveal i={3} className={`picto__grid picto__grid--${of}`}>
          {Array.from({ length: of }, (_, c) => {
            const k = owner(c)
            return (
              <span key={c} className={`picto__cell${k >= 0 ? ` is-${k}` : ''}`} style={vars({ '--k': c })}>
                {icon && <Icon name={icon} size={of === 10 ? 96 : 34} variant="bold" />}
              </span>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
