import { Numeral, Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'

export interface KitBentoProps {
  /** Optional title above the grid, 1 line ≤ 14 字. */
  title?: Text
  /** Exactly 2 figure cards: value ≤ 4 个字符, label ≤ 6 字, body ≤ 22 字. The first shows stacked pages, the second a block layout. */
  stats: { value: string; label: string; body: string }[]
  /** The wide card: title ≤ 10 字, body ≤ 30 字, and 4–6 frame names on the dark canvas (each ≤ 4 字). */
  wide: { title: string; body: string; frames?: string[] }
  hint?: string
}

/** What is in the box, as a bento: two big figures with page sketches, and a wide card with a dark design canvas of frames. Made for `sunrise`, works in any style. */
export function KitBento({ title, stats, wide, hint }: KitBentoProps) {
  const frames = wide.frames ?? ['首页', '定价', '博客', '关于', '联系', '登录']
  return (
    <section className="slide">
      <Hint id="kitbento">{hint}</Hint>
      <div className="sr-sun is-soft" aria-hidden="true" />
      <div className={`frame sr-kit${title ? ' has-title' : ''}`}>
        {title && (
          <Reveal i={0}>
            <h2 className="sr-title sr-kit__title">
              <Lines text={title} />
            </h2>
          </Reveal>
        )}
        <div className="sr-kit__grid">
          {stats.slice(0, 2).map((s, i) => (
            <Reveal key={s.label} i={1 + i} y={36} className="sr-bb">
              <div className="sr-bb__tx">
                <b>
                  <Numeral text={s.value} delay={0.5 + i * 0.15} />
                </b>
                <strong>{s.label}</strong>
                <small>{s.body}</small>
              </div>
              <div className={`sr-bb__vis is-${i ? 'blocks' : 'pages'}`} aria-hidden="true" data-crop>
                {i === 0 ? (
                  <>
                    <div className="sr-page is-a">
                      <i className="h" />
                      <i className="s" />
                      <i className="y" />
                      <i className="p" />
                      <i />
                      <i className="w8" />
                      <span className="sr-page__row">
                        <i />
                        <i />
                        <i />
                      </span>
                      <i />
                      <i className="w6" />
                    </div>
                    <div className="sr-page is-b">
                      <i className="p" />
                      <i />
                      <i className="w6" />
                      <i className="y l" />
                      <i />
                      <i className="w8" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="sr-page is-c">
                      <i className="h w6" />
                      <i className="y" />
                      <i />
                    </div>
                    <div className="sr-page is-d">
                      <i className="p" />
                      <i />
                    </div>
                    <div className="sr-page is-e">
                      <i className="h w4 l" />
                      <i />
                      <i className="w7" />
                      <i className="p sm" />
                    </div>
                  </>
                )}
              </div>
            </Reveal>
          ))}
          <Reveal i={3} y={36} className="sr-bb is-wide">
            <div className="sr-bb__tx">
              <span className="sr-src" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <strong>{wide.title}</strong>
              <small>{wide.body}</small>
            </div>
            <div className="sr-bb__vis">
              <div className="sr-canvas" aria-hidden="true">
                {frames.slice(0, 6).map((f, i) => (
                  <figure key={f} style={{ animationDelay: `${0.8 + i * 0.08}s` }}>
                    <figcaption>{f}</figcaption>
                    <div>
                      <i className="h" />
                      <i />
                      <i className="y" />
                      <i className="b" />
                      <i />
                      <i className="w6" />
                      <span className="sr-page__row">
                        <i />
                        <i />
                      </span>
                      <i />
                      <i className="w4" />
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
