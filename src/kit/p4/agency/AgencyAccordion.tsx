import { useEffect, useState, type CSSProperties } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'

export interface AgencyAccordionItem {
  /** ≤ 10 字. */
  title: string
  /** ≤ 40 字, shown when the row is open. */
  body: string
  /** 0–3 soft chips, each ≤ 5 字. */
  chips?: string[]
  /** Optional landscape photo on the right of the open row. */
  image?: PhotoImage
}

export interface AgencyAccordionProps {
  /** Small white pill at the top left, ≤ 6 字. */
  tag: string
  /** 2 lines × ≤ 12 字, set light on the right half. */
  title: string[]
  /** Tall portrait on the left with a ≤ 12 字 caption chip. */
  photo: { image: PhotoImage; caption?: string }
  /** 3–4 rows. */
  items: AgencyAccordionItem[]
  /** Row open at the start (0-based). Default 0. */
  open?: number
  /** Move to the next row every N ms until someone clicks; 0 turns it off. Default 5600. */
  autoplay?: number
  source?: string
  hint?: string
}

/** Agency method page: a tall portrait beside numbered accordion rows; one row is open with its note, chips and a photo, the rows advance on their own and any row opens on click. */
export function AgencyAccordion({ tag, title, photo, items, open = 0, autoplay = 5600, source, hint }: AgencyAccordionProps) {
  const list = items.slice(0, 4)
  const [on, setOn] = useState(Math.min(open, list.length - 1))
  const [auto, setAuto] = useState(autoplay > 0)
  useEffect(() => {
    if (!auto || list.length < 2) return
    const t = window.setTimeout(() => setOn((x) => (x + 1) % list.length), autoplay)
    return () => window.clearTimeout(t)
  }, [on, auto, autoplay, list.length])
  return (
    <section className="slide ag-soft">
      <Hint id="agencyaccordion">{hint}</Hint>
      <div className="ag-head">
        <Reveal i={0}>
          <span className="ag-tag">{tag}</span>
        </Reveal>
        <Reveal i={0.5}>
          <h2 className="ag-h2">
            {title.slice(0, 2).map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
        </Reveal>
      </div>
      <Reveal i={1} className="ag-acc__photo">
        <figure data-crop>
          <img src={photo.image.src} alt={photo.image.alt} draggable={false} style={{ objectPosition: photo.image.focus ?? 'center' }} />
          {photo.caption && <figcaption>{photo.caption}</figcaption>}
        </figure>
      </Reveal>
      <ol className="ag-acc">
        {list.map((it, i) => (
          <li key={i} className={i === on ? 'ag-acc__row is-on' : 'ag-acc__row'} style={{ '--i': i } as CSSProperties}>
            <button
              type="button"
              className="ag-acc__bar"
              aria-expanded={i === on}
              onClick={() => {
                setAuto(false)
                setOn(i)
              }}
            >
              <em>({String(i + 1).padStart(2, '0')})</em>
              <b>{it.title}</b>
              <i aria-hidden="true" />
            </button>
            <div className="ag-acc__body" data-crop>
              <div>
                <p>{it.body}</p>
                {it.chips && it.chips.length > 0 && (
                  <ul>
                    {it.chips.slice(0, 3).map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>
              {it.image && <img src={it.image.src} alt={it.image.alt} draggable={false} style={{ objectPosition: it.image.focus ?? 'center' }} />}
            </div>
            {i === on && auto && <i className="ag-acc__prog" aria-hidden="true" key={`p${on}`} style={{ animationDuration: `${autoplay}ms` }} />}
          </li>
        ))}
      </ol>
      {source && (
        <div className="ag-foot">
          <SlideFoot source={source} />
        </div>
      )}
    </section>
  )
}
