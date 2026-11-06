// The two ways to read a report: A4 sheets (what prints) and a responsive article.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { PaperContext } from './context'
import type { Plan, Sheet as SheetDef } from './paginate'
import type { ReportDef } from './types'
import { Credit, creditOn } from '../engine/attribution'

type View = 'paper' | 'read'

const WORDS = {
  zh: { paper: '纸张', read: '阅读', pdf: '存为 PDF', contents: '目录', view: '视图' },
  en: { paper: 'Pages', read: 'Read', pdf: 'Save as PDF', contents: 'Contents', view: 'View' },
}

/** Fits sheets to narrow windows on screen only. Print always uses the real size. */
export function useSheetZoom() {
  useLayoutEffect(() => {
    const set = () => {
      const w = document.documentElement.clientWidth
      document.documentElement.style.setProperty('--doc-zoom', String(Math.min(1, (w - 16) / 794)))
      document.documentElement.style.setProperty('--doc-zoom-land', String(Math.min(1, (w - 16) / 1123)))
    }
    set()
    window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])
}

function SheetBox({ sheet, n, total, def, credit }: { sheet: SheetDef; n: number; total: number; def: ReportDef; credit: boolean }) {
  if (sheet.kind === 'cover') return <article className="sheet is-cover" data-page={n}>{sheet.el}</article>
  const last = credit && n === total
  return (
    <article className={`sheet${sheet.kind === 'land' ? ' is-land' : ''}`} data-page={n}>
      <header className="sheet-head"><span><i />{def.title}</span><span>{sheet.section}</span></header>
      <div className="sheet-flow">{sheet.kind === 'land' ? sheet.el : sheet.items}</div>
      <footer className="sheet-foot"><span>{def.footer}</span><span>{last && <><Credit className="sheet-foot__credit" lang={def.lang ?? 'zh'} withUrl /><b aria-hidden>·</b></>}{n} / {total}</span></footer>
    </article>
  )
}

export function ReportView({ def, plan }: { def: ReportDef; plan: Plan }) {
  const words = WORDS[def.lang ?? 'zh']
  const credit = creditOn(def.attribution)
  const [view, setView] = useState<View>(() => {
    const asked = new URLSearchParams(location.search).get('view')
    if (asked === 'read' || asked === 'paper') return asked
    if (def.view) return def.view
    return window.innerWidth < 820 ? 'read' : 'paper'
  })
  const [active, setActive] = useState('')
  const returnTo = useRef<View | null>(null)
  useSheetZoom()

  useEffect(() => {
    document.documentElement.dataset.view = view
    // Ctrl+P from the article view still prints the sheets, then comes back.
    const before = () => {
      if (view === 'paper') return
      returnTo.current = view
      flushSync(() => setView('paper'))
    }
    const after = () => {
      if (returnTo.current) setView(returnTo.current)
      returnTo.current = null
    }
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => {
      window.removeEventListener('beforeprint', before)
      window.removeEventListener('afterprint', after)
    }
  }, [view])

  useEffect(() => {
    const heads = plan.state.toc.map((t) => document.getElementById(t.id)).filter((x): x is HTMLElement => !!x)
    const io = new IntersectionObserver((list) => {
      for (const e of list) if (e.isIntersecting) setActive(e.target.id)
    }, { rootMargin: '-10% 0px -70% 0px' })
    heads.forEach((h) => io.observe(h))
    return () => io.disconnect()
  }, [view, plan])

  const state = useMemo(() => ({ ...plan.state, mode: view }), [plan, view])
  return (
    <PaperContext.Provider value={state}>
      <div className={`doc-app${def.view === 'read' ? ' is-web' : ''}`}>
        <nav className="doc-bar" aria-label={words.view}>
          <b><i />{def.title}</b>
          <div role="group" aria-label={words.view}>
            {(['paper', 'read'] as const).map((v) => <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>{words[v]}</button>)}
          </div>
          <button type="button" className="doc-print" onClick={() => window.print()}>{words.pdf}</button>
        </nav>
        <aside className="doc-side" aria-label={words.contents}>
          <p>{words.contents}</p>
          <ol>
            {plan.state.toc.map((e) => (
              <li key={e.id} className={`is-l${e.level}${active === e.id ? ' is-on' : ''}`}>
                <a href={`#${e.id}`}><span>{e.text}</span>{view === 'paper' && <em>{e.page}</em>}</a>
              </li>
            ))}
          </ol>
        </aside>
        {view === 'paper' ? (
          <main className="doc-desk">
            {plan.sheets.map((s, i) => <SheetBox key={i} sheet={s} n={i + 1} total={plan.sheets.length} def={def} credit={credit} />)}
          </main>
        ) : (
          <main className="doc-article">
            {plan.blocks}
            {credit && <footer className="doc-credit"><Credit lang={def.lang ?? 'zh'} /></footer>}
          </main>
        )}
      </div>
    </PaperContext.Provider>
  )
}
