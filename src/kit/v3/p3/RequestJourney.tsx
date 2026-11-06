import { useRef } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { useStepCount } from '../../v2/p4/util'

export interface JourneyHop {
  icon: IconName
  /** ≤ 6 CJK characters. */
  name: string
  /** ≤ 30 CJK characters. */
  note: string
  /** Mono tag above the name, ≤ 10 characters. */
  tag?: string
}

export interface RequestJourneyProps extends SlideBase {
  /** 3–6 hops, left to right. With build, a glowing packet moves to each hop as it arrives. */
  hops: JourneyHop[]
}

/** A request's path through layers: hops on a glowing wire and a packet that travels hop by hop. */
export function RequestJourney({ kicker, title, lead, source, hint, hops }: RequestJourneyProps) {
  const ref = useRef<HTMLDivElement>(null)
  const n = useStepCount(ref)
  const at = Math.max(0, Math.min(hops.length, n) - 1)
  return (
    <section className="slide">
      <Hint id="journey">{hint}</Hint>
      <div className="frame s-chart">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v33-jour" style={vars({ '--n': hops.length, '--at': at })}>
          <div ref={ref} className="v33-jour__in">
            <div className="v33-jour__wire" aria-hidden>
              <i />
              <b />
            </div>
            {hops.map((h, i) => (
              <div key={h.name} className="v33-jour__hop" data-build={`hop-${i}`} data-step="">
                <div className="v33-jour__node">
                  <Icon name={h.icon} size={64} tone="accent" />
                </div>
                {h.tag && <p className="v33-jour__tag">{h.tag}</p>}
                <h3>{h.name}</h3>
                <p className="v33-jour__note">{h.note}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
