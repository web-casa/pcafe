import type { ReactNode } from 'react'
import { Kicker, Reveal, Source } from '../deck/primitives'
import { Hint, Lines, type SlideBase } from './shared'

export interface SpotlightItem {
  name: string
  /** Short value shown huge on the right: a version, a score, a count. ≤ 6 characters. */
  value: string
  /** Pill next to the name. Only on the spotlight item. */
  tag?: string
}

export interface SpotlightListProps extends SlideBase {
  /** 3–6 items. The first one is the spotlight: accent colour, larger value. */
  items: SpotlightItem[]
  /** One muted line under the list, for the "also included" long tail. */
  extra?: string
  /** Optional detail block above the source in the left column, e.g. a <KeyValue> table. */
  detail?: ReactNode
}

/** A ranked or grouped list of named values, with one item called out. */
export function SpotlightList({ kicker, title, lead, source, hint, items, extra, detail }: SpotlightListProps) {
  return (
    <section className="slide">
      <Hint id="spotlight">{hint}</Hint>
      <div className="frame frame--split">
        <div className="s-copy">
          <Reveal i={0}>
            <Kicker>{kicker}</Kicker>
          </Reveal>
          <Reveal i={1}>
            <h2 className="s-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="s-lead">{lead}</p>
            </Reveal>
          )}
          <Reveal i={5} className="s-foot">
            {detail}
            {source && <Source>{source}</Source>}
          </Reveal>
        </div>

        <div className="desk">
          {items.map((it, i) => (
            <Reveal key={it.name} build i={i + 2} className={`desk__row${i === 0 ? ' is-hero' : ''}`}>
              <span className="desk__name">
                {it.name}
                {it.tag && <span className="pill">{it.tag}</span>}
              </span>
              <span className="desk__ver">{it.value}</span>
            </Reveal>
          ))}
          {extra && (
            <Reveal i={items.length + 3} className="desk__extra">
              {extra}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

export interface KeyValueRow {
  key: string
  /** Plain text, or { from, to } to draw an upgrade arrow. */
  value: string | { from?: string; to: string; note?: string }
}

/** Small mono-keyed table for supporting details (versions, limits, flags). 2–4 rows. */
export function KeyValue({ rows }: { rows: KeyValueRow[] }): ReactNode {
  return (
    <dl className="qt-table">
      {rows.map((r) => (
        <div key={r.key}>
          <dt>{r.key}</dt>
          <dd>
            {typeof r.value === 'string' ? (
              r.value
            ) : (
              <>
                {r.value.from && (
                  <>
                    {r.value.from} <i />
                  </>
                )}
                <b>{r.value.to}</b>
                {r.value.note && ` ${r.value.note}`}
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
