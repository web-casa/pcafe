import { useDeck } from '../deck/Deck'
import { Kicker, Reveal } from '../deck/primitives'
import { pad2 } from '../deck/motion'
import { Icon, type IconName } from './Icon'
import { Hint, Lines, type SlideBase } from './shared'

export interface AgendaItem {
  icon: IconName
  /** ≤ 10 CJK characters. */
  title: string
  /** One line, ≤ 26 CJK characters. */
  body: string
  /** 1-based slide number where the section starts. Clicking the row jumps there. */
  page: number
}

export interface AgendaProps extends Omit<SlideBase, 'source'> {
  /** 3–6 sections, in deck order. */
  items: AgendaItem[]
  /** Muted line under the lead, e.g. '约 30 分钟 · 27 页'. ≤ 20 characters. */
  meta?: string
}

/** Table of contents. Each row is a jump link to the section's first slide. */
export function Agenda({ kicker, title, lead, hint = '点击任一章节直接跳转', items, meta }: AgendaProps) {
  const { go } = useDeck()
  return (
    <section className="slide">
      <Hint id="agenda">{hint}</Hint>
      <div className="frame frame--split">
        <div className="s-copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
          {meta && (
            <Reveal i={3} className="s-foot agenda__meta">
              {meta}
            </Reveal>
          )}
        </div>
        <ol className="agenda">
          {items.map((it, i) => (
            <li key={it.title}>
              <Reveal i={i * 0.8 + 2}>
                <button type="button" className="agenda__row" onClick={() => go(it.page - 1)}>
                  <span className="agenda__idx" data-morph={`chapter-${i + 1}`}>
                    {pad2(i + 1)}
                  </span>
                  <span className="agenda__icon">
                    <Icon name={it.icon} size={40} />
                  </span>
                  <span className="agenda__text">
                    <b>{it.title}</b>
                    <span>{it.body}</span>
                  </span>
                  <span className="agenda__page">
                    P.{pad2(it.page)}
                    <i aria-hidden>→</i>
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
