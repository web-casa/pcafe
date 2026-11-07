import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { type PhotoImage } from '../../v2/p1/img'

export interface WallCloseProps {
  /** ≤ 2 lines × 10 字. */
  title: Text
  /** ≤ 30 字. */
  lead?: string
  ctas?: [string, string?]
  /** Small line under the buttons, ≤ 20 字. */
  note?: string
  /** 6–10 portraits; they fill tilted columns drifting up and down behind the copy. */
  images: PhotoImage[]
  hint?: string
}

/** The close in front of a wall of results: tilted columns of portraits drift past, the ask sits in a pool of dark at the centre. Made for `nocturne`, works in any style. */
export function WallClose({ title, lead, ctas, note, images, hint }: WallCloseProps) {
  const cols = Array.from({ length: 6 }, (_, c) => Array.from({ length: 5 }, (_, r) => images[(c * 3 + r) % images.length]))
  return (
    <section className="slide nc-wall">
      <Hint id="wallclose">{hint}</Hint>
      <div className="nc-wall__bg" aria-hidden="true" data-crop>
        <div className="nc-wall__tilt">
          {cols.map((col, c) => (
            <div key={c} className={`nc-wall__col${c % 2 ? ' is-down' : ''}`} style={{ animationDuration: `${38 + (c % 3) * 6}s` }}>
              {[...col, ...col].map((im, r) => (
                <img key={r} src={im.src} alt="" />
              ))}
            </div>
          ))}
        </div>
        <div className="nc-wall__shade" />
      </div>
      <div className="frame nc-wall__c">
        <Reveal i={1}>
          <h2 className="nc-title nc-wall__title">
            <Lines text={title} />
          </h2>
        </Reveal>
        {lead && (
          <Reveal i={2}>
            <p className="nc-lead">{lead}</p>
          </Reveal>
        )}
        {ctas && (
          <Reveal i={3} className="nc-ctas">
            <span className="nc-btn is-accent">✦ {ctas[0]}</span>
            {ctas[1] && <span className="nc-btn">{ctas[1]}</span>}
          </Reveal>
        )}
        {note && (
          <Reveal i={4}>
            <small className="nc-note">{note}</small>
          </Reveal>
        )}
      </div>
    </section>
  )
}
