import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'

export interface ErColumn {
  /** ≤ 14 Latin characters. */
  name: string
  /** ≤ 12 Latin characters, e.g. "bigint". */
  type: string
  key?: 'pk' | 'fk'
}

export interface ErTable {
  /** ≤ 14 Latin characters. */
  name: string
  /** 2–6 columns. */
  cols: ErColumn[]
  /** Push the table down by this many rows (0–3) to untangle lines. */
  drop?: number
}

export interface ErLink {
  /** "table.column" of the referencing (FK) side. */
  from: string
  /** "table.column" of the referenced (PK) side. */
  to: string
  /** ≤ 6 characters, e.g. "N:1". */
  label?: string
}

export interface SchemaErProps extends SlideBase {
  /** 2–4 tables, laid out left to right in this order. */
  tables: ErTable[]
  /** ≤ 4 links, between neighbouring tables only. */
  links: ErLink[]
  /** One reading under the diagram, ≤ 50 CJK characters. */
  note?: string
}

const W = 1776
const TW = 420
const HEAD = 70
const ROW = 58

/** Entity–relationship diagram: tables with typed columns and PK/FK keys, links drawn as elbows. Each table is a build step with the links into it. */
export function SchemaEr({ kicker, title, lead, source, hint, tables, links, note }: SchemaErProps) {
  const n = tables.length
  const gap = n > 1 ? (W - TW) / (n - 1) : 0
  const idx = new Map(tables.map((t, i) => [t.name, i]))
  const top = (i: number) => (tables[i].drop ?? 0) * ROW
  const H = Math.max(...tables.map((t, i) => top(i) + HEAD + t.cols.length * ROW)) + 4
  const at = (ref: string) => {
    const [t, c] = ref.split('.')
    const i = idx.get(t) ?? 0
    const r = Math.max(0, tables[i].cols.findIndex((col) => col.name === c))
    return { i, y: top(i) + HEAD + r * ROW + ROW / 2 }
  }
  return (
    <section className="slide">
      <Hint id="schemaer">{hint}</Hint>
      <div className="frame t3">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="t3-er" style={vars({ '--h': H })}>
          {[...links].sort((p, q) => Math.max(at(p.from).i, at(p.to).i) - Math.max(at(q.from).i, at(q.to).i)).map((l) => {
            const a = at(l.from)
            const b = at(l.to)
            const rightward = a.i < b.i
            const x1 = a.i * gap + (rightward ? TW : 0)
            const x2 = b.i * gap + (rightward ? 0 : TW)
            const mx = (x1 + x2) / 2
            const step = tables[Math.max(a.i, b.i)].name
            return (
              <div key={l.from + l.to} className="t3-er__link" data-build={step}>
                <svg viewBox={`0 0 ${W} ${H}`} aria-hidden>
                  <path d={`M${x1} ${a.y} H${mx} V${b.y} H${x2}`} />
                  <circle cx={x2} cy={b.y} r={6} />
                </svg>
                {l.label && (
                  <span style={vars({ '--x': mx, '--y': (a.y + b.y) / 2 })}>{l.label}</span>
                )}
              </div>
            )
          })}
          {tables.map((t, i) => (
            <div
              key={t.name}
              className="t3-er__table"
              style={vars({ '--x': i * gap, '--y': top(i) })}
              data-build={i ? t.name : undefined}
            >
              <b>{t.name}</b>
              {t.cols.map((c) => (
                <div key={c.name} className={`t3-er__col${c.key ? ` is-${c.key}` : ''}`}>
                  <i>{c.key ? c.key.toUpperCase() : ''}</i>
                  <span>{c.name}</span>
                  <small>{c.type}</small>
                </div>
              ))}
            </div>
          ))}
        </Reveal>
        {note && (
          <Reveal i={5} className="t3-note">
            {note}
          </Reveal>
        )}
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
