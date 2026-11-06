// Résumés. One data shape, several layouts: swap `layout` and `theme`, keep the content.
// Layouts with graphics also have a plain version from the same data: humans get the
// designed page, upload forms get one clean column.
import { Credit, creditOn } from '../engine/attribution'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSheetZoom } from './Paper'
import { BadgePart, CareerTrack, Gauges, HeatGrid, ImpactRows, Metrics, SlideThumb, TerminalPart } from './resume-parts'
import type { ResumeDef, ResumeSection, ResumeWork } from './types'

const WORDS = {
  zh: { pdf: '存为 PDF', show: '展示版', plain: '投递版', view: '版本' },
  en: { pdf: 'Save as PDF', show: 'Designed', plain: 'Plain', view: 'Version' },
}

const VIVID: ResumeDef['layout'][] = ['showcase', 'console', 'portfolio']

function Work({ w, ledger }: { w: ResumeWork; ledger: boolean }) {
  return (
    <article className="r-work">
      {ledger && <time>{w.period}</time>}
      <div>
        <header>
          <h4><b>{w.org}</b><span>{w.role}</span></h4>
          {!ledger && <time>{w.period}</time>}
        </header>
        {(w.place || w.context) && <p className="r-context">{[w.context, w.place].filter(Boolean).join(' · ')}</p>}
        {w.points && <ul>{w.points.map((p, i) => <li key={i}>{p}</li>)}</ul>}
      </div>
    </article>
  )
}

function Section({ s, def, ledger }: { s: ResumeSection; def: ResumeDef; ledger: boolean }) {
  return (
    <section className={`r-section is-${s.type}`}>
      <h3>{s.title}</h3>
      {s.type === 'work' && s.items.map((w, i) => <Work key={i} w={w} ledger={ledger} />)}
      {s.type === 'tags' && s.groups.map((g, i) => (
        <div key={i} className="r-tags">
          {g.label && <h5>{g.label}</h5>}
          <p>{g.items.map((t) => <span key={t}>{t}</span>)}</p>
        </div>
      ))}
      {s.type === 'list' && <ul className="r-list">{s.items.map((t, i) => <li key={i}>{t}</li>)}</ul>}
      {s.type === 'track' && <CareerTrack items={def.sections.find((x) => x.type === 'work')?.items ?? []} asOf={def.asOf ?? String(new Date().getFullYear())} />}
      {s.type === 'impact' && <ImpactRows rows={s.rows} />}
      {s.type === 'heat' && <HeatGrid years={s.years} rows={s.rows} legend={s.legend} />}
      {s.type === 'gauges' && <Gauges items={s.items} />}
      {s.type === 'projects' && (
        <div className="r-projects">
          {s.items.map((p) => (
            <article key={p.name}>
              {p.shot && <SlideThumb render={p.shot.render} theme={p.shot.theme} style={p.shot.style} width={THUMB_W} />}
              <header><h4><b>{p.name}</b><span>{p.role}</span></h4><time>{p.period}</time></header>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

/** Portfolio page: two columns across 174mm of text, in CSS pixels. */
const THUMB_W = 318

/** The same content as text only, in reading order, for upload forms. */
function toPlain(def: ResumeDef, spill: number): ResumeDef {
  const sections: ResumeSection[] = []
  for (const s of def.sections) {
    const base = { title: s.title }
    if (s.type === 'track') continue
    if (s.type === 'impact') sections.push({ ...base, type: 'list', items: s.rows.map((r) => `${r.label}：${r.before} → ${r.after}${r.unit ?? ''}`) })
    else if (s.type === 'gauges') sections.push({ ...base, type: 'list', items: s.items.map((g) => `${g.label}：${g.text}`) })
    else if (s.type === 'heat') sections.push({ ...base, type: 'tags', groups: [{ items: s.rows.map((r) => r.label) }] })
    else if (s.type === 'projects') sections.push({ ...base, type: 'work', items: s.items.map((p) => ({ org: p.name, role: p.role, period: p.period, points: [p.text] })) })
    else sections.push({ ...s, side: false, page: undefined })
  }
  // One column is longer than the designed page: the last sections move to page 2.
  const cut = sections.length - spill
  return { ...def, layout: 'classic', badge: undefined, terminal: undefined, sections: sections.map((s, i) => (i >= cut ? { ...s, page: 2 as const } : s)) }
}

function Head({ def }: { def: ResumeDef }) {
  return (
    <header className="r-head">
      <div className="r-id">
        <h1>{def.name}</h1>
        <p className="r-headline">{def.headline}</p>
      </div>
      <ul className="r-contact">
        {def.contact.map((c) => <li key={c.value}>{c.href ? <a href={c.href}>{c.value}</a> : c.value}</li>)}
      </ul>
    </header>
  )
}

const Highlights = ({ def }: { def: ResumeDef }) =>
  def.highlights?.length ? (
    <dl className="r-highlights">
      {def.highlights.map((h) => <div key={h.label}><dd>{h.value}</dd><dt>{h.label}</dt></div>)}
    </dl>
  ) : null

const Note = ({ def }: { def: ResumeDef }) => (def.note ? <p className="r-note">{def.note}</p> : null)

function PageOne({ def, sections, foot }: { def: ResumeDef; sections: ResumeSection[]; foot: boolean }) {
  const ledger = def.layout === 'ledger'
  const side = sections.filter((s) => s.side)
  const main = sections.filter((s) => !s.side)
  const list = (xs: ResumeSection[], l = false) => xs.map((s) => <Section key={s.title} s={s} def={def} ledger={l} />)
  const summary = <p className="r-summary">{def.summary}</p>
  if (def.layout === 'sidebar') {
    return (
      <div className="r-grid">
        <div className="r-aside">
          <Head def={def} />
          {list(side)}
        </div>
        <div className="r-main">
          {summary}
          <Highlights def={def} />
          {list(main)}
          {foot && <Note def={def} />}
        </div>
      </div>
    )
  }
  if (def.layout === 'banner') {
    return (
      <>
        <div className="r-band">
          <Head def={def} />
          <Highlights def={def} />
        </div>
        <div className="r-grid">
          <div className="r-main">
            {summary}
            {list(main)}
          </div>
          <div className="r-aside">{list(side)}</div>
        </div>
        {foot && <Note def={def} />}
      </>
    )
  }
  if (def.layout === 'showcase') {
    const track = main.filter((s) => s.type === 'track')
    const rest = main.filter((s) => s.type !== 'track')
    return (
      <>
        <div className="r-hero">
          <div className="r-hero__copy">
            <Head def={def} />
            {summary}
          </div>
          {def.badge && <BadgePart badge={def.badge} name={def.name} width={150} />}
        </div>
        {def.highlights && <Metrics items={def.highlights} />}
        {list(track)}
        <div className="r-grid">
          <div className="r-main">{list(rest)}</div>
          <div className="r-aside">{list(side)}</div>
        </div>
        {foot && <Note def={def} />}
      </>
    )
  }
  if (def.layout === 'console') {
    return (
      <>
        <div className="r-band">
          <div className="r-band__id">
            <Head def={def} />
          </div>
          {def.terminal && <TerminalPart terminal={def.terminal} width={410} />}
        </div>
        <div className="r-grid">
          <div className="r-main">
            {summary}
            {list(main)}
          </div>
          <div className="r-aside">{list(side)}</div>
        </div>
        {foot && <Note def={def} />}
      </>
    )
  }
  if (def.layout === 'portfolio') {
    return (
      <>
        <Head def={def} />
        <div className="r-lede">
          {summary}
          {def.highlights && <Metrics items={def.highlights} />}
        </div>
        {list([...main, ...side])}
        {foot && <Note def={def} />}
      </>
    )
  }
  return (
    <>
      <Head def={def} />
      {summary}
      <Highlights def={def} />
      {list([...main, ...side], ledger)}
      {foot && <Note def={def} />}
    </>
  )
}

/** Does every column stop at its bottom margin? scrollHeight would let content run into the padding. */
function fits(sheet: HTMLElement) {
  return [...sheet.querySelectorAll<HTMLElement>('.r-page, .r-grid, .r-main, .r-aside')].every((col) => {
    const limit = col.getBoundingClientRect().bottom - parseFloat(getComputedStyle(col).paddingBottom)
    return [...col.children].every((c) => c.getBoundingClientRect().bottom <= limit + 0.5)
  })
}

/** Opens up the spacing until the page is comfortably full. It never shrinks anything: too much content stays an overflow for QA to report. */
function useBreathing(dep: unknown) {
  const box = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    for (const sheet of box.current?.querySelectorAll<HTMLElement>('.sheet') ?? []) {
      // Measure at print size, so the result does not depend on the window.
      // Reduced motion gives everything a tiny transition, which would make these reads stale.
      sheet.classList.add('is-measuring')
      sheet.style.zoom = '1'
      sheet.style.setProperty('--r-air', '0px')
      if (fits(sheet)) {
        let lo = 0
        let hi = 16
        for (let i = 0; i < 7; i++) {
          const mid = (lo + hi) / 2
          sheet.style.setProperty('--r-air', `${mid}px`)
          if (fits(sheet)) lo = mid
          else hi = mid
        }
        sheet.style.setProperty('--r-air', `${lo}px`)
      }
      sheet.style.zoom = ''
      sheet.classList.remove('is-measuring')
    }
  }, [dep])
  return box
}

export function ResumeView({ def: source }: { def: ResumeDef }) {
  const words = WORDS[source.lang ?? 'zh']
  const credit = creditOn(source.attribution) ? <Credit className="r-credit" lang={source.lang ?? 'zh'} withUrl /> : null
  useSheetZoom()
  const vivid = VIVID.includes(source.layout)
  const [plain, setPlain] = useState(() => vivid && new URLSearchParams(location.search).has('plain'))
  const [spill, setSpill] = useState(0)
  const def = useMemo(() => (plain ? toPlain(source, spill) : source), [plain, source, spill])
  const box = useBreathing(def)
  useLayoutEffect(() => {
    if (!plain) return
    const first = box.current?.querySelector<HTMLElement>('.sheet')
    if (!first || spill >= def.sections.length - 1) return
    first.classList.add('is-measuring')
    first.style.zoom = '1'
    const over = !fits(first)
    first.style.zoom = ''
    first.classList.remove('is-measuring')
    if (over) setSpill((n) => n + 1)
  }, [plain, def, spill, box])
  const [one, two] = useMemo(() => [def.sections.filter((s) => s.page !== 2), def.sections.filter((s) => s.page === 2)], [def])
  useLayoutEffect(() => { document.documentElement.dataset.plain = String(plain) }, [plain])
  return (
    <div className="doc-app is-resume">
      <nav className="doc-bar">
        <b><i />{def.name}</b>
        {vivid && (
          <div role="group" aria-label={words.view}>
            <button type="button" aria-pressed={!plain} onClick={() => { setPlain(false); setSpill(0) }}>{words.show}</button>
            <button type="button" aria-pressed={plain} onClick={() => setPlain(true)}>{words.plain}</button>
          </div>
        )}
        <button type="button" className="doc-print" onClick={() => window.print()}>{words.pdf}</button>
      </nav>
      <main className="doc-desk" ref={box} key={String(plain)}>
        <article className={`sheet r r--${def.layout}`} data-page={1}>
          <div className="r-page"><PageOne def={def} sections={one} foot={!two.length} /></div>
          {!two.length && credit}
        </article>
        {two.length > 0 && (
          <article className={`sheet r r--${def.layout} is-second`} data-page={2}>
            <div className="r-page">
              {two.map((s) => <Section key={s.title} s={s} def={def} ledger={def.layout === 'ledger'} />)}
              <Note def={def} />
            </div>
            {credit}
          </article>
        )}
      </main>
    </div>
  )
}
