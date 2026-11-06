import type { CSSProperties } from 'react'
import { useAgenda, useRuntime } from './runtime'
import type { Session } from './types'

// Scene templates. Every one has a landscape and a portrait layout of its own in screen.css; none is a
// slide scaled down. Text sizes come from the venue, so a field that is too long overflows and the QA
// says so. Cut the copy; do not change the size.

/** Small print at the foot, for people who walk up to the screen. */
export function Fine({ source, credit }: { source: string; credit?: string }) {
  return (
    <p className="sc-fine" data-tier="fine">
      {source}
      {credit ? <span className="sc-fine__credit">{credit}</span> : null}
    </p>
  )
}

export interface Art {
  /** A `decor-` or `photo-` import. */
  src: string
  /** disc: a large round form bleeding off one side. ground: a surface fading up from the foot. */
  mode: 'disc' | 'ground'
}

function ArtLayer({ art }: { art?: Art }) {
  if (!art) return null
  return <img className={`sc-art sc-art--${art.mode}`} src={art.src} alt="" decoding="async" />
}

function Lines({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className={`ln${className ? ` ${className}` : ''}`} style={{ '--i': i } as CSSProperties}>{l}</span>
      ))}
    </>
  )
}

export interface HeroProps {
  /** ≤ 12 CJK characters. */
  kicker?: string
  /** One to three lines. Landscape: ≤ 10 CJK characters a line. Portrait: ≤ 5. */
  title: string[]
  /** Line breaks for a portrait display, on a screen that plays in both. */
  portraitTitle?: string[]
  /** One sentence. Landscape: ≤ 40 CJK characters. Portrait: ≤ 28. */
  sub?: string
  art?: Art
  /** The one fact behind the scene. Say "全部为虚构示例" for sample data. */
  source: string
  credit?: string
}

/** One message filling the screen. */
export function Hero({ kicker, title, portraitTitle, sub, art, source, credit }: HeroProps) {
  const rt = useRuntime()
  const lines = portraitTitle && rt.orientation() === 'portrait' ? portraitTitle : title
  return (
    <section className={`sc sc-hero${art ? ` has-${art.mode}` : ''}`}>
      <ArtLayer art={art} />
      <div className="sc-body">
        {kicker ? <p className="sc-kicker">{kicker}</p> : null}
        <h1 className="sc-title"><Lines lines={lines} /></h1>
        {sub ? <p className="sc-sub">{sub}</p> : null}
      </div>
      <Fine source={source} credit={credit} />
    </section>
  )
}

export interface BigNumberProps {
  /** ≤ 12 CJK characters. */
  kicker?: string
  /** ≤ 7 characters. Sized to the width of the screen. */
  value: string
  /** ≤ 4 characters. */
  unit?: string
  /** ≤ 12 CJK characters. */
  label: string
  /** One sentence, ≤ 30 CJK characters. */
  note?: string
  art?: Art
  source: string
  credit?: string
}

/** One number, the only thing on the screen. */
export function BigNumber({ kicker, value, unit, label, note, art, source, credit }: BigNumberProps) {
  return (
    <section className={`sc sc-num${art ? ` has-${art.mode}` : ''}`}>
      <ArtLayer art={art} />
      <div className="sc-body">
        {kicker ? <p className="sc-kicker">{kicker}</p> : null}
        <p className="sc-num__figure" style={{ '--chars': value.length } as CSSProperties}>
          <span className="sc-num__value">{value}</span>
          {unit ? <span className="sc-num__unit">{unit}</span> : null}
        </p>
        <p className="sc-num__label">{label}</p>
        {note ? <p className="sc-sub">{note}</p> : null}
      </div>
      <Fine source={source} credit={credit} />
    </section>
  )
}

export interface MomentsProps {
  kicker?: string
  /** ≤ 8 CJK characters a line, one or two lines. */
  title: string[]
  /** 3 to 5. They light up one by one across the scene's time. */
  items: { when: string; at?: string; label: string }[]
  source: string
}

/** A short sequence of events on a rail. */
export function Moments({ kicker, title, items, source }: MomentsProps) {
  return (
    <section className="sc sc-moments">
      <div className="sc-body">
        <header className="sc-moments__head">
          {kicker ? <p className="sc-kicker">{kicker}</p> : null}
          <h1 className="sc-title"><Lines lines={title} /></h1>
        </header>
        <ol className="sc-moments__rail" style={{ '--n': items.length } as CSSProperties}>
          {items.map((m, i) => (
            <li key={i} className="sc-moment" style={{ '--i': i } as CSSProperties}>
              <span className="sc-moment__when">{m.when}{m.at ? <i>{m.at}</i> : null}</span>
              <span className="sc-moment__label">{m.label}</span>
            </li>
          ))}
        </ol>
      </div>
      <Fine source={source} />
    </section>
  )
}

export interface QuoteProps {
  kicker?: string
  /** The words people read, one to four lines. Landscape: ≤ 13 CJK characters a line. Portrait: ≤ 8. */
  lines: string[]
  /** The original wording, in the language it was said. */
  original?: string
  /** Who and when. */
  by: string
  source: string
}

export function Quote({ kicker, lines, original, by, source }: QuoteProps) {
  return (
    <section className="sc sc-quote">
      <div className="sc-body">
        {kicker ? <p className="sc-kicker">{kicker}</p> : null}
        <blockquote className="sc-quote__text"><Lines lines={lines} /></blockquote>
        {original ? <p className="sc-quote__original">{original}</p> : null}
        <p className="sc-quote__by">{by}</p>
      </div>
      <Fine source={source} />
    </section>
  )
}

export interface PairProps {
  kicker?: string
  /** Two halves. The second is the one that lands. Each `big` ≤ 7 CJK characters. */
  items: [{ big: string; small: string }, { big: string; small: string }]
  source: string
}

export function Pair({ kicker, items, source }: PairProps) {
  return (
    <section className="sc sc-pair">
      <div className="sc-body">
        {kicker ? <p className="sc-kicker">{kicker}</p> : null}
        <div className="sc-pair__grid">
          {items.map((p, i) => (
            <div key={i} className="sc-pair__item" style={{ '--i': i } as CSSProperties}>
              <p className="sc-pair__big">{p.big}</p>
              <p className="sc-pair__small">{p.small}</p>
            </div>
          ))}
        </div>
      </div>
      <Fine source={source} />
    </section>
  )
}

export interface BoardProps {
  kicker?: string
  /** ≤ 10 CJK characters. */
  title: string
  /** 2 to 5 rows. `left` ≤ 6 CJK characters; `right` ≤ 12. */
  rows: { left: string; right: string }[]
  source: string
}

/** A short fixed table: rooms, prices, opening hours. */
export function Board({ kicker, title, rows, source }: BoardProps) {
  return (
    <section className="sc sc-board">
      <div className="sc-body">
        {kicker ? <p className="sc-kicker">{kicker}</p> : null}
        <h1 className="sc-title"><Lines lines={[title]} /></h1>
        <ul className="sc-rows">
          {rows.map((r, i) => (
            <li key={i} className="sc-row" style={{ '--i': i } as CSSProperties}>
              <span className="sc-row__left">{r.left}</span>
              <span className="sc-row__right">{r.right}</span>
            </li>
          ))}
        </ul>
      </div>
      <Fine source={source} />
    </section>
  )
}

const LABEL = {
  zh: { now: '正在进行', next: '下一场', soon: '即将开始', done: '今日议程已结束', min: '分钟', left: '还剩', in: '后开始', breakNow: '休息中', thanks: '感谢到场', agenda: '今日议程', none: '今天没有安排', hours: '小时' },
  en: { now: 'Now', next: 'Next', soon: 'Starting soon', done: 'That is all for today', min: 'min', left: 'left', in: 'to go', breakNow: 'On a break', thanks: 'Thank you', agenda: 'Today', none: 'Nothing scheduled today', hours: 'h' },
}

function span(minutes: number, L: typeof LABEL.zh) {
  if (minutes < 90) return `${minutes} ${L.min}`
  return `${Math.floor(minutes / 60)} ${L.hours} ${minutes % 60} ${L.min}`
}

const whereOf = (s: Session) => [s.who, s.room].filter(Boolean).join(' · ')

/** Computed from the clock and ScreenDef.agenda: what is on, what is next. Handles before, during, a break, and after. */
export function NowNext({ source }: { source: string }) {
  const rt = useRuntime()
  const a = useAgenda()
  const L = LABEL[rt.def.lang === 'en' ? 'en' : 'zh']
  const isBreak = a.now?.isBreak
  const head = a.phase === 'during' ? (isBreak ? L.breakNow : L.now) : a.phase === 'gap' ? L.soon : a.phase === 'before' ? L.soon : a.phase === 'after' ? L.done : L.none
  const main = a.phase === 'during' ? a.now : a.next
  const showNext = a.phase === 'during' && a.next
  return (
    <section className="sc sc-now" data-phase={a.phase}>
      <div className="sc-body">
        <p className="sc-now__tag"><span className="sc-now__dot" />{head}</p>
        {main ? (
          <>
            <h1 className="sc-now__title">{main.title}</h1>
            <p className="sc-now__time">
              {whereOf(main) ? <span>{whereOf(main)}</span> : null}
              <span>{`${main.start}–${main.end}`}</span>
              {a.phase === 'during' && a.left !== null ? <b>{`${L.left} ${span(a.left, L)}`}</b> : null}
              {a.phase !== 'during' && a.toNext !== null ? <b>{`${span(a.toNext, L)}${L.in}`}</b> : null}
            </p>
            {a.phase === 'during' ? <div className="sc-now__bar"><i style={{ width: `${Math.round(a.progress * 100)}%` }} /></div> : null}
          </>
        ) : (
          <h1 className="sc-now__title">{a.phase === 'after' ? L.thanks : L.none}</h1>
        )}
        {showNext && a.next ? (
          <div className="sc-now__next">
            <span className="sc-now__nextlabel">{`${L.next} ${a.next.start}`}</span>
            <span className="sc-now__nexttitle">{a.next.title}</span>
          </div>
        ) : null}
      </div>
      <Fine source={source} />
    </section>
  )
}

/** Today's list from ScreenDef.agenda. Past sessions step off the top as the day goes on. */
export function Agenda({ title, source }: { title?: string; source: string }) {
  const rt = useRuntime()
  const a = useAgenda()
  const L = LABEL[rt.def.lang === 'en' ? 'en' : 'zh']
  const rows = rt.orientation() === 'portrait' ? 5 : 4
  const cur = a.now ? a.today.indexOf(a.now) : a.next ? a.today.indexOf(a.next) : a.today.length - 1
  const first = Math.max(0, Math.min(cur - 1, a.today.length - rows))
  const shown = a.today.slice(first, first + rows)
  return (
    <section className="sc sc-agenda">
      <div className="sc-body">
        <h1 className="sc-agenda__title">{title ?? L.agenda}</h1>
        <ol className="sc-agenda__list">
          {shown.map((s) => {
            const state = s === a.now ? 'now' : s === a.next ? 'next' : a.today.indexOf(s) < cur ? 'past' : 'later'
            return (
              <li key={`${s.start}${s.title}`} className="sc-slot" data-state={state}>
                <span className="sc-slot__time">{s.start}</span>
                <span className="sc-slot__title">{s.title}</span>
                {s.room ? <span className="sc-slot__room">{s.room}</span> : null}
              </li>
            )
          })}
        </ol>
      </div>
      <Fine source={source} />
    </section>
  )
}

