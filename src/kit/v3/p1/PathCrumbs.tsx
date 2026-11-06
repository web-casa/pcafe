import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface PathCrumb {
  /** ≤ 8 字 or ≤ 14 个字符. */
  label: string
  /** Mono line under the label, ≤ 16 个字符. */
  sub?: string
  /** Card text below the crumb, ≤ 50 字. */
  body: string
  /** Small tag in the card, ≤ 8 字. */
  tag?: string
}

export interface PathCrumbsProps extends SlideBase {
  /** 3–5 crumbs, upstream first. PathCrumb and card build together. */
  crumbs: PathCrumb[]
  /** Highlighted crumb. Default the last. */
  focus?: number
}

/** A breadcrumb trail of chevron segments with a card under each: lineage, pipeline or path from one thing to the next. */
export function PathCrumbs({ kicker, title, lead, crumbs, focus = crumbs.length - 1, source, hint }: PathCrumbsProps) {
  return (
    <section className="slide">
      <Hint id="pathcrumbs">{hint}</Hint>
      <div className="frame d1-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="d1crumb" style={{ ['--n' as string]: crumbs.length }}>
          {crumbs.map((c, i) => (
            <div key={i} className={`d1crumb__chev${i === focus ? ' is-on' : ''}${i === 0 ? ' is-first' : ''}${i === crumbs.length - 1 ? ' is-last' : ''}`} data-build={`c${i}`}>
              <b>{c.label}</b>
              {c.sub && <span>{c.sub}</span>}
            </div>
          ))}
          {crumbs.map((c, i) => (
            <div key={i} className={`d1crumb__card${i === focus ? ' is-on' : ''}`} data-build={`c${i}`}>
              {c.tag && <span className="d1crumb__tag">{c.tag}</span>}
              <p>{c.body}</p>
            </div>
          ))}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
