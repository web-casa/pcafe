import { useEffect, useState } from 'react'
import type { EmojiStyle } from '../emoji'
import { useT } from './i18n'

type Row = [char: string, name: string, group: string, subgroup: string]
const hex = (c: string) => [...c].map((x) => x.codePointAt(0)!.toString(16)).join('-')
const STYLES: EmojiStyle[] = ['fluent', 'flat', 'noto']

/** Every bundled emoji. Dev only: a build embeds just the ones its text uses, so it has no copy of the set to show. */
export function EmojiWall({ n }: { n: string }) {
  const t = useT()
  const [rows, setRows] = useState<Row[]>([])
  const [style, setStyle] = useState<EmojiStyle>('fluent')
  const [q, setQ] = useState('')
  const [copied, setCopied] = useState('')
  useEffect(() => {
    if (import.meta.env.DEV) fetch('/@emoji/index.json').then((r) => r.json()).then(setRows)
  }, [])
  const shown = rows.filter((r) => !q || r[1].includes(q.toLowerCase()) || r[3].includes(q.toLowerCase()) || r[0] === q)
  const groups = [...new Set(shown.map((r) => r[2]))]
  const copy = (c: string) => navigator.clipboard?.writeText(c).then(() => setCopied(c))
  return (
    <section className="kit-icons" id="emoji" aria-labelledby="emoji-h">
      <div className="kit-entry__head">
        <span className="kit-entry__n">{n}</span>
        <div>
          <h2 id="emoji-h">
            {t.emojiIndex}
            <code>{t.emojiCode}</code>
          </h2>
          <p className="kit-entry__role">{t.emojiRole(rows.length || '—', style, copied)}</p>
        </div>
      </div>
      <p className="kit-entry__summary">
        {t.emojiSummary[0]}
        <code>emojiStyle</code>
        {t.emojiSummary[1]}
        {import.meta.env.DEV ? null : t.emojiDevOnly}
      </p>
      <div className="kit-style kit-emoji__tools" role="radiogroup" aria-label={t.emojiSeries}>
        <span className="kit-style__label">{t.emojiSeries}</span>
        <div className="kit-style__opts">
          {STYLES.map((s) => (
            <button key={s} type="button" role="radio" aria-checked={style === s} className={style === s ? 'is-on' : undefined} onClick={() => setStyle(s)}>
              <span>{s}</span>
            </button>
          ))}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.emojiSearch} aria-label={t.emojiSearchLabel} />
      </div>
      {groups.map((g) => (
        <div key={g} className="kit-icons__group kit-emoji__group">
          <h3>{g}</h3>
          <ul>
            {shown.filter((r) => r[2] === g).map((r) => (
              <li key={r[0]}>
                <button type="button" title={r[1]} onClick={() => copy(r[0])}>
                  <img src={`/@emoji/${style}/${hex(r[0])}.svg`} alt={r[1]} width={40} height={40} loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
