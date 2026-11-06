import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface LaneCard {
  /** ≤ 14 CJK characters. */
  title: string
  /** ≤ 28 CJK characters. */
  body?: string
  /** Mono chip, ≤ 12 characters: an owner, a version, a date. */
  tag?: string
}

export interface Lane {
  /** ≤ 6 CJK characters, e.g. '现在', '下一步', '之后'. */
  label: string
  /** Muted line beside the label, ≤ 12 characters: a period or a release. */
  sub?: string
  icon?: IconName
  /** 2–4 cards. Lanes may differ by one card at most. */
  cards: LaneCard[]
}

export interface LanesProps extends SlideBase {
  /** 3 or 4 lanes in time order. */
  lanes: Lane[]
  /** The lane the audience acts on: accent header, raised cards. */
  focus?: number
}

/** Now / next / later: work sorted into lanes by horizon, not by date. */
export function Lanes({ kicker, title, lead, source, hint, lanes, focus = 0 }: LanesProps) {
  return (
    <section className="slide">
      <Hint id="lanes">{hint}</Hint>
      <div className="frame s-lanes">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="lanes" style={{ gridTemplateColumns: `repeat(${lanes.length}, minmax(0, 1fr))` }}>
          {lanes.map((l, c) => (
            <div key={l.label} className={`lanes__col${c === focus ? ' is-focus' : ''}`} data-build>
              <Reveal i={c * 0.6 + 3} className="lanes__head">
                {l.icon && <Icon name={l.icon} size={30} tone={c === focus ? 'accent' : 'ink'} />}
                <h3>{l.label}</h3>
                {l.sub && <span>{l.sub}</span>}
                <b>{l.cards.length}</b>
              </Reveal>
              {l.cards.map((k, i) => (
                <Reveal key={k.title} i={c * 0.6 + i * 0.35 + 3.5} className="lanes__card">
                  <h4>{k.title}</h4>
                  {k.body && <p>{k.body}</p>}
                  {k.tag && <code>{k.tag}</code>}
                </Reveal>
              ))}
            </div>
          ))}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
