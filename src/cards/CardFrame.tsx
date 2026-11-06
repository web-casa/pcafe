import type { CSSProperties } from 'react'
import { CardContext } from './context'
import { metrics, PRESETS, type PresetName } from './presets'
import { CardBody, SHAPES } from './templates'
import type { CardDef, CardSetDef, CardTone } from './types'
import { Credit, creditOn } from '../engine/attribution'

export interface Placed {
  card: CardDef
  name: PresetName
  index: number
  /** 1-based position among cards of the same size; 0 hides the number. */
  page: number
  pages: number
  cover: boolean
}

/** Works out each card's preset, page number and cover flag once, for every view. */
export function place(set: CardSetDef): Placed[] {
  const named = set.cards.map((c) => c.preset ?? set.preset)
  const counts = new Map<string, number>()
  for (const n of named) counts.set(n, (counts.get(n) ?? 0) + 1)
  const seen = new Map<string, number>()
  return set.cards.map((card, index) => {
    const name = named[index]
    const position = (seen.get(name) ?? 0) + 1
    seen.set(name, position)
    const preset = PRESETS[name]
    const cover = card.cover ?? (index === 0 || ('coverOnly' in preset && !!preset.coverOnly))
    const show = set.pages ?? (counts.get(name) ?? 0) > 1
    return { card, name, index, page: show && !cover ? position : 0, pages: counts.get(name) ?? 0, cover }
  })
}

const DEFAULT_TONE: Partial<Record<CardDef['t'], CardTone>> = { cover: 'accent', wide: 'accent', ending: 'ink', quote: 'ink' }

export function CardFrame({ set, placed }: { set: CardSetDef; placed: Placed }) {
  const { card, name, index, page, pages, cover } = placed
  const preset = PRESETS[name]
  const base = metrics(preset)
  const inner = card.t !== 'wide' && card.t !== 'cover' && (base.shape === 'landscape' || base.shape === 'wide' || base.shape === 'banner')
  const m = inner ? metrics(preset, true) : base
  const compact = 'compact' in preset && !!preset.compact
  const tone = card.tone ?? DEFAULT_TONE[card.t] ?? 'paper'
  const credit = !compact && index === set.cards.length - 1 && creditOn(set.attribution)
  const style = {
    width: `${preset.w}px`,
    height: `${preset.h}px`,
    '--u': `${m.scale}px`,
    // Text starts inside a vertical crop as well as inside the safe zone.
    '--st': `calc(${Math.max(m.inset.top, (m.unitH - m.cropH) / 2)} * var(--u))`,
    '--sr': `calc(${m.inset.right} * var(--u))`,
    '--sb': `calc(${m.inset.bottom} * var(--u))`,
    '--sl': `calc(${m.inset.left} * var(--u))`,
  } as CSSProperties
  return (
    <CardContext.Provider value={{ preset, m }}>
      <article
        className="cd"
        style={style}
        data-i={index}
        data-t={card.t}
        data-ct={tone}
        data-shape={m.shape}
        data-preset={name}
        data-w={preset.w}
        data-h={preset.h}
        data-cover={cover || undefined}
        data-compact={compact || undefined}
        data-unsupported={SHAPES[card.t].includes(m.shape) ? undefined : m.shape}
      >
        <div className="cd-in">
          {!compact && (card.kicker || page > 0) && (
            <header className="cd-top">
              {card.kicker ? <span className="cd-kicker" data-max={14}>{card.kicker}</span> : <span />}
              {page > 0 && <span className="cd-page" data-small>{page}/{pages}</span>}
            </header>
          )}
          <main className="cd-main"><CardBody card={card} /></main>
          {!compact && (card.source || set.handle || credit) && (
            <footer className="cd-foot">
              <span className="cd-source" data-small data-max={44}>{card.source}</span>
              {(set.handle || credit) && (
                <span className="cd-handle" data-small>
                  {set.handle && <span>{set.handle}</span>}
                  {credit && <Credit className="cd-credit" lang={set.lang ?? 'zh'} withUrl />}
                </span>
              )}
            </footer>
          )}
        </div>
      </article>
    </CardContext.Provider>
  )
}
