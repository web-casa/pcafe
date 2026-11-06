import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface RackUnit {
  /** ≤ 10 CJK characters. */
  name: string
  /** Mono tag on the right, ≤ 12 characters. */
  tag?: string
}

export interface ServerRackProps extends SlideBase {
  /** 4–8 units, top to bottom. With build, units power on one by one. */
  units: RackUnit[]
  /** 1–3 points beside the rack, each ≤ 36 CJK characters. */
  points?: string[]
  /** Small caption above the rack, ≤ 12 characters. */
  label?: string
}

/** A server rack whose units each carry one service, LEDs blinking; for "everything runs on every machine". */
export function ServerRack({ kicker, title, lead, source, hint, units, points = [], label }: ServerRackProps) {
  return (
    <section className="slide">
      <Hint id="rack">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="v33-rack">
          <Reveal i={3} className="v33-rack__box">
            {label && <p className="v33-rack__label">{label}</p>}
            {units.map((u, i) => (
              <div key={u.name} className="v33-rack__u" data-build="" style={vars({ '--k': i })}>
                <span className="v33-rack__leds" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="v33-rack__name">{u.name}</span>
                <span className="v33-rack__vent" aria-hidden />
                {u.tag && <em>{u.tag}</em>}
              </div>
            ))}
          </Reveal>
          {points.length > 0 && (
            <Reveal i={4} className="v33-rack__pts">
              {points.map((p, i) => (
                <p key={i}>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  {p}
                </p>
              ))}
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
