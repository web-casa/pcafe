import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { MotionGlobalConfig } from 'motion/react'
import type { DeckDef, SlideDef } from '../Deck'
import type { FeatureProps } from '.'
import { DeckContext } from '../context'
import { DESIGN_W, UnitScope } from '../Stage'
import { pad2 } from '../motion'
import { DEFAULT_STYLE, themeVars, toneOf, type DeckStyle } from '../../kit/theme'
import { BackdropLayer } from './backdrop'
import type { Blank, Frozen, Screen } from './screen'
import { KeyHelp, PRESENTER_KEYS } from './help'

/*
 * Sync protocol (BroadcastChannel `pcafe:<title>`, plus window.opener
 * postMessage as a fallback for browsers that isolate file:// pages):
 *   audience  → presenter  { kind: 'state', index, step, builds, blank, frozen } on every change
 *                          { kind: 'beat', from: 'audience' } every second
 *   presenter → audience   { kind: 'key', key } | { kind: 'go', index } | { kind: 'hello' }
 *                          { kind: 'beat', from: 'presenter' } every second | { kind: 'bye' } when the window closes
 * A side that hears nothing for LOST_MS treats the other window as gone.
 */
type State = { index: number; step: number | null; builds: number; blank: Blank; frozen: Frozen }
type Msg =
  | ({ kind: 'state' } & State)
  | { kind: 'key'; key: string }
  | { kind: 'go'; index: number }
  | { kind: 'hello' }
  | { kind: 'beat'; from: 'audience' | 'presenter' }
  | { kind: 'bye' }

const BEAT_MS = 1000
const LOST_MS = 3500

const TAG = 'pcafe-presenter'
const channelName = (title: string) => `pcafe:${title}`

function useChannel(title: string, onMsg: (m: Msg) => void, peer: () => Window | null | undefined) {
  const handler = useRef(onMsg)
  handler.current = onMsg
  const ch = useRef<BroadcastChannel | null>(null)
  useEffect(() => {
    const seen: string[] = []
    const receive = (d: { tag?: string; title?: string; id?: string; msg?: Msg } | null) => {
      if (d?.tag !== TAG || d.title !== title || !d.id || seen.includes(d.id)) return
      seen.push(d.id)
      if (seen.length > 50) seen.shift()
      handler.current(d.msg!)
    }
    let bc: BroadcastChannel | null = null
    try {
      bc = new BroadcastChannel(channelName(title))
      bc.onmessage = (e) => receive(e.data)
    } catch {
      bc = null
    }
    ch.current = bc
    const onPost = (e: MessageEvent) => receive(e.data)
    window.addEventListener('message', onPost)
    return () => {
      bc?.close()
      window.removeEventListener('message', onPost)
    }
  }, [title])
  return (m: Msg) => {
    // Both paths fire: some browsers give each file:// page its own origin, so BroadcastChannel stays silent there.
    // The receiver drops the duplicate by id.
    const env = { tag: TAG, title, id: `${Date.now()}-${Math.random()}`, msg: m }
    ch.current?.postMessage(env)
    try {
      peer()?.postMessage(env, '*')
    } catch {
      /* window closed */
    }
  }
}

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName ?? ''))
}

let presenterWin: Window | null = null

/**
 * Inside the deck: S opens the presenter window and keeps it in sync.
 * If the presenter window goes away while the audience is frozen, the freeze
 * lifts so the room sees the live slide again; a blank screen stays (B restores it).
 */
export function PresenterSync({ title, index, step, builds, overview, go, screen }: FeatureProps & { screen: Screen }) {
  const { blank, frozen, release } = screen
  // Last time the presenter window was heard from; 0 = no presenter so far.
  const heard = useRef(0)
  const send = useChannel(
    title,
    (m) => {
      if (m.kind === 'state' || (m.kind === 'beat' && m.from === 'audience')) return
      heard.current = m.kind === 'bye' ? Date.now() - LOST_MS + 1500 : Date.now()
      if (m.kind === 'go') go(m.index)
      else if (m.kind === 'key') document.body.dispatchEvent(new KeyboardEvent('keydown', { key: m.key, bubbles: true, cancelable: true }))
      else if (m.kind === 'hello') send({ kind: 'state', ...stateRef.current })
    },
    () => presenterWin ?? (window.opener as Window | null),
  )
  const stateRef = useRef<State>({ index, step, builds, blank, frozen })
  stateRef.current = { index, step, builds, blank, frozen }

  useEffect(() => {
    send({ kind: 'state', index, step, builds, blank, frozen })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, step, builds, blank, frozen])

  useEffect(() => {
    const id = setInterval(() => {
      send({ kind: 'beat', from: 'audience' })
      if (heard.current && Date.now() - heard.current > LOST_MS) {
        heard.current = 0
        if (stateRef.current.frozen) release()
      }
    }, BEAT_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [release])

  useEffect(() => {
    if (overview) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
      if (e.key.toLowerCase() !== 's') return
      e.preventDefault()
      const url = `${location.pathname}${location.search}#/presenter`
      presenterWin = window.open(url, channelName(title), 'popup,width=1280,height=800')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overview, title])
  return null
}

/* ── Shared: one slide rendered statically in a scaled 1920×1080 box ──────── */

const noop = () => {}

export function StaticSlide({ slide, style, u, index, total }: { slide: SlideDef; style: DeckStyle; u: number; index: number; total: number }) {
  return (
    <UnitScope u={u}>
      <DeckContext.Provider value={{ index, total, go: noop, hintSlot: null, arriving: [] }}>
        <div className="stage p5-static" data-tone={toneOf(slide.tone, style) ?? 'light'} style={{ '--u': `${u}px` } as CSSProperties} inert>
          <div className="slide-frame">{slide.render()}</div>
        </div>
      </DeckContext.Provider>
    </UnitScope>
  )
}

/** Box that measures its width and renders the slide at that scale. */
function SlideBox({ slide, style, index, total, className, children }: { slide?: SlideDef; style: DeckStyle; index: number; total: number; className?: string; children?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const [u, setU] = useState(0)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setU(el.clientWidth / DESIGN_W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className={`pv__screen ${className ?? ''}`} ref={box}>
      {slide && u > 0 ? <StaticSlide key={slide.id} slide={slide} style={style} u={u} index={index} total={total} /> : <span className="pv__end">演示结束</span>}
      {children}
    </div>
  )
}

/** Theme vars + style on the root, like Deck does. */
export function useDeckRoot(deck: DeckDef, view: string) {
  const style = deck.style ?? DEFAULT_STYLE
  useLayoutEffect(() => {
    const root = document.documentElement
    const v = Object.entries(themeVars(deck.theme, style))
    for (const [k, val] of v) root.style.setProperty(k, String(val))
    root.dataset.style = style
    root.dataset.p5 = view
    return () => {
      v.forEach(([k]) => root.style.removeProperty(k))
      delete root.dataset.style
      delete root.dataset.p5
    }
  }, [deck.theme, style, view])
  useEffect(() => {
    // Static renders: every intro animation jumps to its end state.
    const prev = MotionGlobalConfig.skipAnimations
    MotionGlobalConfig.skipAnimations = true
    return () => void (MotionGlobalConfig.skipAnimations = prev)
  }, [])
  return style
}

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  return `${h ? `${h}:` : ''}${pad2(Math.floor(s / 60) % 60)}:${pad2(s % 60)}`
}
/** Actual minus planned, e.g. +00:12 or −01:05. */
const fmtDiff = (ms: number) => `${ms >= 0 ? '+' : '−'}${fmt(Math.abs(ms))}`

/*
 * Rehearsal: time is booked to the slide on screen while the timer runs.
 * Results survive a reload through localStorage; without storage the timer still works.
 */
type Rehearsal = { per: number[]; since: number | null; at: number }
const storeKey = (title: string) => `pcafe:rehearsal:${title}`
function loadPer(title: string, total: number) {
  let saved: unknown = null
  try {
    saved = JSON.parse(localStorage.getItem(storeKey(title)) ?? 'null')
  } catch {
    saved = null
  }
  const per = (saved as { per?: unknown } | null)?.per
  return Array.from({ length: total }, (_, i) => (Array.isArray(per) ? Math.max(0, Number(per[i]) || 0) : 0))
}
function savePer(title: string, per: number[]) {
  try {
    if (per.some((v) => v > 0)) localStorage.setItem(storeKey(title), JSON.stringify({ per: per.map(Math.round), savedAt: Date.now() }))
    else localStorage.removeItem(storeKey(title))
  } catch {
    /* storage blocked: keep the times in memory only */
  }
}
/** Book the running stretch to the slide it was spent on. */
const settle = (r: Rehearsal, now: number) => (r.since === null ? r.per : r.per.map((v, i) => (i === r.at ? v + Math.max(0, now - r.since!) : v)))

let audienceWin: Window | null = null

/** `#/presenter`: current + next slide, notes, rehearsal timer, audience screen controls. */
export function PresenterView({ deck }: { deck: DeckDef }) {
  const style = useDeckRoot(deck, 'presenter')
  const { slides, title } = deck
  const total = slides.length
  const [st, setSt] = useState<State>({ index: 0, step: null, builds: 0, blank: null, frozen: null })
  const [clock, setClock] = useState(() => Date.now())
  const [opened] = useState(() => Date.now())
  // Last time the audience window was heard from; 0 = never.
  const heard = useRef(0)
  const greeted = useRef(false)
  const [rh, setRh] = useState<Rehearsal>(() => ({ per: loadPer(title, total), since: null, at: 0 }))
  const rhRef = useRef(rh)
  rhRef.current = rh
  const [table, setTable] = useState(false)

  const peer = () => (audienceWin && !audienceWin.closed ? audienceWin : (window.opener as Window | null))
  const send = useChannel(
    title,
    (m) => {
      if (m.kind === 'beat' && m.from === 'audience') heard.current = Date.now()
      if (m.kind === 'state') {
        const first = !greeted.current
        greeted.current = true
        heard.current = Date.now()
        setSt({ index: m.index, step: m.step, builds: m.builds, blank: m.blank ?? null, frozen: m.frozen ?? null })
        // The first connection starts the timer, unless a rehearsal is already on the clock.
        if (first) setRh((r) => (r.since === null && !r.per.some((v) => v > 0) ? { ...r, since: Date.now(), at: m.index } : r))
      }
    },
    peer,
  )

  useEffect(() => {
    document.title = `演讲者视图 · ${title}`
    send({ kind: 'hello' })
    const tick = setInterval(() => setClock(Date.now()), 500)
    const beat = setInterval(() => send({ kind: 'beat', from: 'presenter' }), BEAT_MS)
    const bye = () => {
      send({ kind: 'bye' })
      savePer(title, settle(rhRef.current, Date.now()))
    }
    window.addEventListener('pagehide', bye)
    return () => {
      clearInterval(tick)
      clearInterval(beat)
      window.removeEventListener('pagehide', bye)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  // Changing slides books the time so far to the slide that was showing.
  useEffect(() => {
    setRh((r) => (r.at === st.index ? r : r.since === null ? { ...r, at: st.index } : { per: settle(r, Date.now()), since: Date.now(), at: st.index }))
  }, [st.index])
  useEffect(() => savePer(title, rh.per), [title, rh.per])
  useEffect(() => {
    if (rh.since === null) return
    const id = setInterval(() => savePer(title, settle(rhRef.current, Date.now())), 5000)
    return () => clearInterval(id)
  }, [title, rh.since])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return
      const nav = ['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 'Home', 'End', ' ']
      const screenKey = ['b', 'w', 'h'].includes(e.key.toLowerCase())
      if (nav.includes(e.key) || screenKey) {
        e.preventDefault()
        send({ kind: 'key', key: screenKey ? e.key.toLowerCase() : e.key })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const win = peer()
  const link = win?.closed ? 'off' : heard.current && clock - heard.current < LOST_MS ? 'on' : !heard.current && clock - opened < LOST_MS ? 'wait' : 'off'
  const reopen = () => {
    audienceWin = window.open(`${location.pathname}${location.search}#/${st.index + 1}`, `pcafe-audience:${title}`)
  }
  const press = (key: string) => send({ kind: 'key', key })

  const running = rh.since !== null
  const live = (i: number) => rh.per[i] + (running && rh.at === i ? Math.max(0, clock - rh.since!) : 0)
  const spent = rh.per.reduce((a, b) => a + b, 0) + (running ? Math.max(0, clock - rh.since!) : 0)
  const planOf = (s?: SlideDef) => (s?.seconds && s.seconds > 0 ? s.seconds * 1000 : 0)
  const planTotal = slides.reduce((a, s) => a + planOf(s), 0)
  const slide = slides[st.index]
  const plan = planOf(slide)
  const here = live(st.index)
  const toggleRun = () => setRh((r) => (r.since !== null ? { per: settle(r, Date.now()), since: null, at: r.at } : { ...r, since: Date.now(), at: st.index }))
  const reset = () => setRh({ per: Array(total).fill(0), since: null, at: st.index })

  const building = st.step !== null && !!slide?.build && st.builds > 0
  const frozenSlide = st.frozen ? slides[st.frozen.index] : undefined
  const on = link === 'on'

  return (
    <div className="pv" data-tone="light">
      <div className="pv__bar">
        <b>{title}</b>
        <span className={`pv__link is-${link}`} role="status">
          <i aria-hidden />
          {link === 'on' ? '已连接放映窗口' : link === 'wait' ? '正在连接放映窗口……' : '放映窗口未连接'}
        </span>
        {link === 'off' && (
          <button type="button" className="pv__reopen" onClick={reopen}>
            重新打开放映窗口
          </button>
        )}
        {on && st.blank && <span className="pv__chip">{st.blank === 'black' ? '观众屏幕：黑屏' : '观众屏幕：白屏'}</span>}
        {on && st.frozen && <span className="pv__chip">观众画面已冻结</span>}
        <span className="pv__clock">{new Date(clock).toLocaleTimeString('zh-CN', { hour12: false })}</span>
      </div>
      <div className="pv__main">
        <section className="pv__now">
          <SlideBox slide={slide} style={style} index={st.index} total={total} className={on && (st.blank || st.frozen) ? 'is-held' : undefined}>
            {on && st.frozen && (
              <div className="pv__frozen" role="status">
                <b>观众停在 {pad2(st.frozen.index + 1)}</b> {frozenSlide?.label} · 按 <kbd>H</kbd> 解除，观众跟到这一页
              </div>
            )}
            {on && st.blank && (
              <div className="pv__cover" data-blank={st.blank} role="status">
                <b>{st.blank === 'black' ? '观众屏幕已黑屏' : '观众屏幕已白屏'}</b>
                <span>
                  按 <kbd>{st.blank === 'black' ? 'B' : 'W'}</kbd> 恢复，翻页照常进行
                </span>
              </div>
            )}
          </SlideBox>
          <div className="pv__meta">
            <span className="pv__page">
              {pad2(st.index + 1)} <i>/ {pad2(total)}</i>
            </span>
            <span className="pv__label">{slide?.label}</span>
            {building && (
              <span className="pv__steps" aria-label={`第 ${st.step} / ${st.builds} 项`}>
                {Array.from({ length: st.builds }, (_, i) => (
                  <i key={i} className={i < st.step! ? 'is-on' : undefined} />
                ))}
                <em>
                  {st.step} / {st.builds}
                </em>
              </span>
            )}
          </div>
          <div className="pv__screenbtns" role="group" aria-label="观众屏幕">
            <button type="button" disabled={!on} aria-pressed={st.blank === 'black'} onClick={() => press('b')}>
              黑屏 <kbd>B</kbd>
            </button>
            <button type="button" disabled={!on} aria-pressed={st.blank === 'white'} onClick={() => press('w')}>
              白屏 <kbd>W</kbd>
            </button>
            <button type="button" disabled={!on} aria-pressed={!!st.frozen} onClick={() => press('h')}>
              {st.frozen ? '解除冻结' : '冻结画面'} <kbd>H</kbd>
            </button>
          </div>
        </section>
        <aside className="pv__side">
          <div className="pv__next">
            <span className="pv__cap">下一页</span>
            <SlideBox slide={slides[st.index + 1]} style={style} index={st.index + 1} total={total} />
          </div>
          <div className="pv__timer">
            <span className="pv__cap">
              排练计时 · <span className={running ? 'is-run' : undefined}>{running ? '计时中' : spent > 0 ? '已暂停' : '未开始'}</span>
            </span>
            <dl className="pv__clocks">
              <div>
                <dt>总用时</dt>
                <dd>
                  <span className="pv__time">{fmt(spent)}</span>
                  {planTotal > 0 && (
                    <em className={spent > planTotal ? 'is-over' : undefined}>
                      计划 {fmt(planTotal)}
                      {spent > planTotal && ` · 超出 ${fmt(spent - planTotal)}`}
                    </em>
                  )}
                </dd>
              </div>
              <div>
                <dt>本页</dt>
                <dd>
                  <span className="pv__time pv__time--sm">{fmt(here)}</span>
                  {plan > 0 ? (
                    <em className={here > plan ? 'is-over' : undefined}>
                      计划 {fmt(plan)}
                      {here > plan ? ` · 超时 ${fmt(here - plan)}` : ` · 剩 ${fmt(plan - here)}`}
                    </em>
                  ) : (
                    <em>这一页没有计划时间</em>
                  )}
                </dd>
              </div>
            </dl>
            {plan > 0 && (
              <span className={`pv__meter${here > plan ? ' is-over' : ''}`} aria-hidden>
                <i style={{ width: `${Math.min(100, (here / plan) * 100)}%` }} />
              </span>
            )}
            <div className="pv__btns">
              <button type="button" onClick={toggleRun}>
                {running ? '暂停计时' : spent > 0 ? '继续计时' : '开始计时'}
              </button>
              <button type="button" onClick={reset} disabled={!spent}>
                重置计时
              </button>
              <button type="button" aria-pressed={table} onClick={() => setTable((t) => !t)}>
                {table ? '看备注' : '每页用时'}
              </button>
            </div>
          </div>
          {table ? (
            <div className="pv__notes pv__notes--table">
              <span className="pv__cap">每页用时</span>
              <table className="pv__table">
                <thead>
                  <tr>
                    <th>页</th>
                    <th>标题</th>
                    <th>计划</th>
                    <th>实际</th>
                    <th>差</th>
                  </tr>
                </thead>
                <tbody>
                  {slides.map((s, i) => {
                    const p = planOf(s)
                    const a = live(i)
                    return (
                      <tr key={s.id} className={i === st.index ? 'is-current' : undefined}>
                        <td>{pad2(i + 1)}</td>
                        <td>{s.label}</td>
                        <td>{p ? fmt(p) : '—'}</td>
                        <td>{a ? fmt(a) : '—'}</td>
                        <td className={p && a > p ? 'is-over' : undefined}>{p && a ? fmtDiff(a - p) : ''}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td />
                    <td>合计</td>
                    <td>{planTotal ? fmt(planTotal) : '—'}</td>
                    <td>{fmt(spent)}</td>
                    <td className={planTotal && spent > planTotal ? 'is-over' : undefined}>{planTotal && spent ? fmtDiff(spent - planTotal) : ''}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="pv__notes">
              <span className="pv__cap">备注</span>
              {slide?.notes ? <p>{slide.notes}</p> : <p className="pv__empty">这一页没有备注</p>}
            </div>
          )}
        </aside>
      </div>
      <div className="pv__hint">
        <kbd>←</kbd>
        <kbd>→</kbd> 翻页 · <kbd>Space</kbd> 下一步 · <kbd>B</kbd> 黑屏 · <kbd>W</kbd> 白屏 · <kbd>H</kbd> 冻结 · <kbd>?</kbd> 全部快捷键
      </div>
      <KeyHelp groups={PRESENTER_KEYS} />
    </div>
  )
}

/** `#/print`: every slide fully built, one per page, for Save as PDF. */
export function PrintView({ deck }: { deck: DeckDef }) {
  const style = useDeckRoot(deck, 'print')
  const { slides, title } = deck
  const total = slides.length
  useEffect(() => {
    document.title = title
  }, [title])
  return (
    <div className="pp">
      <div className="pp__bar">
        <span>
          <b>{title}</b> · 共 {total} 页
        </span>
        <button type="button" onClick={() => window.print()}>
          打印 / 存为 PDF
        </button>
      </div>
      {slides.map((s, i) => (
        <div className="pp__page" key={s.id}>
          <UnitScope u={1}>
            <DeckContext.Provider value={{ index: i, total, go: noop, hintSlot: null, arriving: [] }}>
              <div className="stage p5-static" data-tone={toneOf(s.tone, style) ?? 'light'} style={{ '--u': '1px' } as CSSProperties}>
                <header className="slide-header">
                  <div className="slide-header__mark">
                    <span className="slide-header__dot" />
                    <span>{title}</span>
                    <span className="slide-header__sep" />
                    <span className="slide-header__muted">{s.label}</span>
                  </div>
                  <div className="slide-header__hint" />
                  <div className="slide-header__page">
                    <span>{pad2(i + 1)}</span>
                    <span className="slide-header__muted">/ {pad2(total)}</span>
                  </div>
                </header>
                <BackdropLayer backdrop={s.backdrop ?? deck.backdrop} />
                <div className="slide-frame">{s.render()}</div>
              </div>
            </DeckContext.Provider>
          </UnitScope>
        </div>
      ))}
    </div>
  )
}
