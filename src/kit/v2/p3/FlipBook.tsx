import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface BookPage {
  /** ≤ 8 CJK characters. */
  label?: string
  /** Big figure, ≤ 7 characters. */
  value?: string
  /** ≤ 12 CJK characters. */
  title: string
  /** ≤ 56 CJK characters. */
  body?: string
}

export interface FlipBookProps extends SlideBase {
  /** 2–4 spreads (left + right page). Each build step turns one page over in 3D. */
  spreads: { left: BookPage; right: BookPage }[]
  /** Optional decor- paper texture for the pages (imported asset). */
  texture?: string
}

function Page({ p, side }: { p: BookPage; side: 'l' | 'r' }) {
  return (
    <div className={`c3book__page c3book__page--${side}`}>
      {p.label && <span className="c3-tag">{p.label}</span>}
      {p.value && <b>{p.value}</b>}
      <h3>{p.title}</h3>
      {p.body && <p>{p.body}</p>}
    </div>
  )
}

/** Open book: each build step turns the right-hand page over the spine to reveal the next spread. */
export function FlipBook({ kicker, title, lead, spreads, texture, source, hint }: FlipBookProps) {
  const leaves = spreads.slice(0, -1)
  const n = leaves.length
  return (
    <section className="slide">
      <Hint id="flipbook">{hint}</Hint>
      <div className="frame c3-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="c3book" style={texture ? vars({ '--tex': `url(${texture})` }) : undefined}>
          <div className="c3book__spread">
            <div className="c3book__base c3book__base--l">
              <Page p={spreads[0].left} side="l" />
            </div>
            <div className="c3book__base c3book__base--r">
              <Page p={spreads[spreads.length - 1].right} side="r" />
            </div>
            {leaves.map((s, i) => (
              <div key={i} className={`c3book__leaf${i === n - 1 ? " is-last" : ""}`} data-build="" style={vars({ '--k': i, '--n': n })}>
                <div className="c3book__side c3book__side--front">
                  <Page p={s.right} side="r" />
                </div>
                <div className="c3book__side c3book__side--back">
                  <Page p={spreads[i + 1].left} side="l" />
                </div>
              </div>
            ))}
            <i className="c3book__spine" aria-hidden />
          </div>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
