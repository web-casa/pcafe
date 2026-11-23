import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { EmberAsk, type EmberAskProps } from './parts'

export interface EmberCloseProps {
  /** 2 lines × ≤ 9 字, serif, set inside the ring. */
  title: string[]
  /** ≤ 36 字. */
  lead?: string
  /** A dark picture with a ring of light, centred behind the title. */
  image: PhotoImage
  ask?: EmberAskProps
  /** Light button and a text link, each ≤ 8 字. */
  ctas?: [string, string?]
  /** ≤ 30 字. */
  note?: string
  hint?: string
}

/** The last slide: a ring of light breathing behind a serif line, a compact prompt box and the call to action. */
export function EmberClose({ title, lead, image, ask, ctas, note, hint }: EmberCloseProps) {
  return (
    <section className="slide eb">
      <Hint id="emberclose">{hint}</Hint>
      <div className="eb-ring" aria-hidden="true" data-crop>
        <img src={image.src} alt="" draggable={false} style={{ objectPosition: image.focus ?? 'center' }} />
      </div>
      <div className="eb-close">
        <Reveal i={0.3}>
          <h2 className="eb-h1 is-close">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
        </Reveal>
        {lead && (
          <Reveal i={0.8}>
            <p className="eb-lead is-center">{lead}</p>
          </Reveal>
        )}
        {ask && (
          <Reveal i={1.2}>
            <EmberAsk compact {...ask} />
          </Reveal>
        )}
        {ctas && (
          <Reveal i={1.6}>
            <div className="eb-ctas">
              <span className="eb-btn">{ctas[0]}</span>
              {ctas[1] && <span className="eb-link">{ctas[1]} →</span>}
            </div>
          </Reveal>
        )}
        {note && (
          <Reveal i={1.9}>
            <p className="eb-note">{note}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
