import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface LogoItem {
  /** Placeholder or generic name, ≤ 8 CJK characters. Never a real brand. */
  name: string
  /** ≤ 8 CJK characters, e.g. the role. */
  role?: string
}

export interface LogoWallProps extends SlideBase {
  /** 6–12 items, laid out 3–4 per row. */
  items: LogoItem[]
  /** Small note under the wall, ≤ 30 CJK characters, e.g. "标识为示意". */
  note?: string
}

// Twelve drawn placeholder marks (abstract geometry, no real brands).
const MARKS = [
  <circle key="a" cx="24" cy="24" r="16" fill="none" strokeWidth="6" />,
  <path key="b" d="M24 6 42 40H6Z" />,
  <path key="c" d="M24 4 41 14v20L24 44 7 34V14Z" fill="none" strokeWidth="5" />,
  <g key="d"><rect x="6" y="8" width="36" height="8" rx="4" /><rect x="6" y="20" width="26" height="8" rx="4" /><rect x="6" y="32" width="16" height="8" rx="4" /></g>,
  <path key="e" d="M8 40V8h14a10 10 0 0 1 0 20H8" fill="none" strokeWidth="6" strokeLinejoin="round" />,
  <g key="f"><circle cx="16" cy="24" r="11" /><circle cx="32" cy="24" r="11" fillOpacity="0.5" /></g>,
  <path key="g" d="M6 34 18 14l10 14 6-8 8 14Z" />,
  <g key="h"><rect x="6" y="6" width="16" height="16" rx="3" /><rect x="26" y="6" width="16" height="16" rx="8" /><rect x="6" y="26" width="16" height="16" rx="8" /><rect x="26" y="26" width="16" height="16" rx="3" /></g>,
  <path key="i" d="M24 4a20 20 0 1 0 20 20H24Z" />,
  <path key="j" d="M6 24c6-12 12-12 18 0s12 12 18 0" fill="none" strokeWidth="6" strokeLinecap="round" />,
  <path key="k" d="M24 4 28 20 44 24 28 28 24 44 20 28 4 24 20 20Z" />,
  <g key="l"><rect x="20" y="4" width="8" height="40" rx="4" /><rect x="4" y="20" width="40" height="8" rx="4" /></g>,
]

/** A wall of partner / participant marks in hairline cells. Marks are drawn placeholders: label them as such. */
export function LogoWall({ kicker, title, lead, items, note, source, hint }: LogoWallProps) {
  const list = items.slice(0, 12)
  const cols = list.length <= 6 ? 3 : 4
  return (
    <section className="slide">
      <Hint id="logowall">{hint}</Hint>
      <div className="frame s-lwall">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="lwall__grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {list.map((it, k) => (
            <Reveal key={k} i={3 + k * 0.5} build={`r${Math.floor(k / cols)}`} className="lwall__cell">
              <svg className="lwall__mark" viewBox="0 0 48 48" aria-hidden>
                {MARKS[k % MARKS.length]}
              </svg>
              <div className="lwall__name">
                <b>{it.name}</b>
                {it.role && <span>{it.role}</span>}
              </div>
            </Reveal>
          ))}
        </div>
        {note && (
          <Reveal i={9} className="lwall__note">
            <p>{note}</p>
          </Reveal>
        )}
        <SlideFoot source={source} i={10} />
      </div>
    </section>
  )
}
