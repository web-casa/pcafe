import { Kicker, Reveal } from '../deck/primitives'
import { pad2 } from '../deck/motion'
import { CornerFrame } from './decor'
import { Hint, Lines, type Text } from './shared'

export interface PillAgendaProps {
  kicker: string
  /** 3–6 chapter names, each ≤ 8 CJK characters. */
  chapters: string[]
  /** Index of the chapter this page opens. */
  current: number
  /** The chapter's title, ≤ 2 lines × 10 CJK characters. */
  title: Text
  /** ≤ 60 CJK characters. */
  lead?: string
  hint?: string
}

/** Chapter opener: the chapters as underlined pills, the current one lit, and a framed giant number. */
export function PillAgenda({ kicker, chapters, current, title, lead, hint }: PillAgendaProps) {
  return (
    <section className="slide">
      <Hint id="pillagenda">{hint}</Hint>
      <div className="frame s-pillag">
        <Reveal i={0}>
          <nav className="pillag__nav" aria-label="章节">
            {chapters.map((c, i) => (
              <span key={c} className={i === current ? 'is-now' : i < current ? 'is-done' : undefined}>
                <em>{pad2(i + 1)}</em>
                {c}
              </span>
            ))}
          </nav>
        </Reveal>
        <div className="pillag__body">
          <Reveal i={2}>
            <CornerFrame className="pillag__num">
              <b>{pad2(current + 1)}</b>
            </CornerFrame>
          </Reveal>
          <div className="pillag__copy">
            <Reveal i={1}>
              <Kicker>{kicker}</Kicker>
            </Reveal>
            <Reveal i={2}>
              <h2 className="break__title pillag__title">
                <Lines text={title} />
              </h2>
            </Reveal>
            {lead && (
              <Reveal i={3} className="pillag__lead">
                {lead}
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
