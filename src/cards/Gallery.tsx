import { useEffect, useState } from 'react'
import { CardFrame, place, type Placed } from './CardFrame'
import { metrics, PRESETS } from './presets'
import type { CardSetDef } from './types'

type View = 'full' | 'feed'

const TEXT = {
  zh: { full: '整张', feed: '信息流大小', safe: '安全区', cards: '张', est: '估算' , note: '大小和安全区多为社区资料，发布前在 App 里确认。' },
  en: { full: 'Full', feed: 'Feed size', safe: 'Safe zone', cards: 'cards', est: 'estimate', note: 'Most sizes and safe zones are community values. Check in the app before posting.' },
}

const STATUS = {
  zh: { official: '官方', community: '第三方', conflict: '来源矛盾', unconfirmed: '未确认' },
  en: { official: 'official', community: 'third-party', conflict: 'sources conflict', unconfirmed: 'unconfirmed' },
}

/** Safe zone, blocked strips and crop, as drawn over a card. Percentages, so it scales with the view. */
function Guides({ placed }: { placed: Placed }) {
  const p = PRESETS[placed.name]
  const { safe, w, h } = p
  const blocked = 'blocked' in p ? p.blocked : undefined
  const crop = 'crop' in p ? p.crop : undefined
  const m = metrics(p)
  const cw = (m.cropW / m.unitW) * 100
  const ch = (m.cropH / m.unitH) * 100
  return (
    <div className="cg-guides" aria-hidden>
      <i className="cg-safe" style={{ top: `${(safe.top / h) * 100}%`, right: `${(safe.right / w) * 100}%`, bottom: `${(safe.bottom / h) * 100}%`, left: `${(safe.left / w) * 100}%` }} />
      {blocked?.map((b) => <i key={b.label} className="cg-block" style={{ left: `${(b.x / w) * 100}%`, top: `${(b.y / h) * 100}%`, width: `${(b.w / w) * 100}%`, height: `${(b.h / h) * 100}%` }}><em>{b.label}</em></i>)}
      {crop && <i className="cg-crop" style={{ left: `${(100 - cw) / 2}%`, top: `${(100 - ch) / 2}%`, width: `${cw}%`, height: `${ch}%` }}><em>{crop.label}</em></i>}
    </div>
  )
}

function useWidth() {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

export function Gallery({ set }: { set: CardSetDef }) {
  const [view, setView] = useState<View>('full')
  const [guides, setGuides] = useState(false)
  const placed = place(set)
  const vw = useWidth()
  const t = TEXT[set.lang === 'en' ? 'en' : 'zh']
  const status = STATUS[set.lang === 'en' ? 'en' : 'zh']
  const shown = view === 'feed' ? placed.filter((p) => p.cover) : placed
  return (
    <div className="cg" data-view={view}>
      <header className="cg-bar">
        <b>{set.title}</b>
        <span className="cg-count">{placed.length} {t.cards}</span>
        <div role="group">
          <button aria-pressed={view === 'full'} onClick={() => setView('full')}>{t.full}</button>
          <button aria-pressed={view === 'feed'} onClick={() => setView('feed')}>{t.feed}</button>
        </div>
        <button className="cg-toggle" aria-pressed={guides} onClick={() => setGuides(!guides)}>{t.safe}</button>
      </header>
      <p className="cg-note">{t.note}</p>
      <div className="cg-grid">
        {shown.map((p) => {
          const preset = PRESETS[p.name]
          const fit = Math.min(1, (vw - 32) / preset.w, (vw < 640 ? 640 : 560) / preset.h)
          const zoom = view === 'feed' ? preset.feed.w / preset.w : fit
          return (
            <figure key={p.index} className="cg-item">
              <div className="cg-box" style={{ width: preset.w * zoom, height: preset.h * zoom }}>
                <div style={{ zoom }}><CardFrame set={set} placed={p} /></div>
                {guides && view === 'full' && <Guides placed={p} />}
              </div>
              <figcaption>
                <b>{preset.label}</b> {preset.w}×{preset.h}
                {view === 'feed' ? <span>{preset.feed.w} px · {preset.feed.where}</span> : <span title={preset.basis}>{status[preset.status]}</span>}
              </figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}

/** Cards alone at real size, in order: what export and QA look at. */
export function ExportStack({ set, only }: { set: CardSetDef; only?: string | null }) {
  return (
    <div className="cd-stack">
      {place(set).filter((p) => !only || p.name === only).map((p) => <CardFrame key={p.index} set={set} placed={p} />)}
    </div>
  )
}
