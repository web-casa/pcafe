import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { FolioRail, type FolioFrame } from './parts'

export interface FolioHeroProps {
  /** Status pill with a live green dot, ≤ 14 字. */
  status: string
  /** Who is speaking: round avatar, name ≤ 8 字, note (email, city…) ≤ 24 个字符. */
  person?: { avatar: PhotoImage; name: string; note?: string }
  /** Grey first line, ≤ 6 字. */
  pre: string
  /** Black second line, ≤ 6 字. */
  title: string
  /** ≤ 60 字. */
  lead?: string
  /** Ink button and a plain button, each ≤ 8 字. */
  ctas?: [string, string?]
  /** 3–5 skill chips along the foot, each ≤ 6 字. */
  tags?: string[]
  /** Underlined link after the chips, ≤ 6 字. */
  link?: string
  /** 2–4 framed pictures on the right rail; the first is in view. */
  frames: FolioFrame[]
  hint?: string
}

/** A portfolio opening: status, avatar, a two-tone promise and buttons on the left; a rail of framed work on the right that slides when you pick a tick. */
export function FolioHero({ status, person, pre, title, lead, ctas, tags = [], link, frames, hint }: FolioHeroProps) {
  const [focus, setFocus] = useState(0)
  return (
    <section className="slide fo">
      <Hint id="foliohero">{hint}</Hint>
      <div className="fo-side">
        <div className="fo-hero">
          <Reveal i={0} className="fo-status">
            <i />
            {status}
          </Reveal>
          {person && (
            <Reveal i={1} className="fo-me">
              <img src={person.avatar.src} alt={person.avatar.alt} draggable={false} />
              <span>
                <b>{person.name}</b>
                {person.note && <small>{person.note}</small>}
              </span>
            </Reveal>
          )}
          <Reveal i={2}>
            <h1 className="fo-h1">
              <span>{pre}</span>
              {title}
            </h1>
          </Reveal>
          {lead && (
            <Reveal i={3}>
              <p className="fo-lead">{lead}</p>
            </Reveal>
          )}
          {ctas && (
            <Reveal i={4} className="fo-ctas">
              <span className="fo-btn is-ink">
                {ctas[0]}
                <i>→</i>
              </span>
              {ctas[1] && <span className="fo-btn">{ctas[1]}</span>}
            </Reveal>
          )}
        </div>
        {(tags.length > 0 || link) && (
          <Reveal i={6} className="fo-tags">
            {tags.slice(0, 5).map((t) => (
              <span key={t}>{t}</span>
            ))}
            {link && <u>{link}</u>}
          </Reveal>
        )}
      </div>
      <FolioRail frames={frames.slice(0, 4)} focus={focus} onFocus={setFocus} height={600} align="top" />
    </section>
  )
}
