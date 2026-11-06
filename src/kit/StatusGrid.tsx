import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export type Status = 'ok' | 'new' | 'partial' | 'off'

export const STATUS_LABELS: Record<Status, string> = { ok: '支持', new: '新增', partial: '部分', off: '不支持' }

export interface StatusTile {
  /** Mono name, ≤ 10 characters: 'amd64', '销售'. */
  name: string
  /** Muted line under the name, ≤ 12 CJK characters. */
  sub?: string
  status: Status
  /** ≤ 24 CJK characters: the condition behind a partial or off. */
  note?: string
}

export interface StatusGridProps extends SlideBase {
  /** 6–10 tiles, in the order you'd read them. Columns: 3 for 6, 4 for 7–8, 5 for 9–10. */
  tiles: StatusTile[]
  /** Rename the four states for this slide, e.g. { ok: '就绪', off: '阻塞' }. */
  labels?: Partial<Record<Status, string>>
}

/** Status at a glance: one tile per item with a state chip. Legend counts each state. */
export function StatusGrid({ kicker, title, lead, source, hint, tiles, labels }: StatusGridProps) {
  const names = { ...STATUS_LABELS, ...labels }
  const cols = tiles.length <= 6 ? 3 : tiles.length <= 8 ? 4 : 5
  const used = (Object.keys(names) as Status[]).filter((s) => tiles.some((t) => t.status === s))
  return (
    <section className="slide">
      <Hint id="status">{hint}</Hint>
      <div className="frame s-status">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="status__legend">
          {used.map((s) => (
            <span key={s} className={`status__chip is-${s}`}>
              {names[s]}
              <b>{tiles.filter((t) => t.status === s).length}</b>
            </span>
          ))}
        </Reveal>
        <div className="status" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {tiles.map((t, i) => (
            <Reveal key={t.name} build i={i * 0.35 + 3.5} className={`status__tile is-${t.status}`}>
              <div className="status__top">
                <code>{t.name}</code>
                <span className={`status__chip is-${t.status}`}>{names[t.status]}</span>
              </div>
              {t.sub && <p className="status__sub">{t.sub}</p>}
              {t.note && <p className="status__note">{t.note}</p>}
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
