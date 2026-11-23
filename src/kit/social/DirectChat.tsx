import { useState, type CSSProperties } from 'react'
import { Reveal } from '../../deck/primitives'
import { Hint, SlideFoot } from '../shared'
import type { PhotoImage } from '../v2/p1/img'
import { Avatar, SoSide, type SocialClock, type SocialMenuItem, type SocialProfile } from './parts'

export interface DirectChatMessage {
  /** "me" is the profile owner (accent bubble, right); "you" is the visitor. */
  from: 'me' | 'you'
  /** ≤ 40 字. */
  text: string
}

export interface DirectChatProps {
  profile: SocialProfile
  /** 4–6 menu items. */
  menu: SocialMenuItem[]
  active?: number
  clock?: SocialClock
  /** Green line under the name, ≤ 12 字. */
  status?: string
  /** 3–5 messages. */
  messages: DirectChatMessage[]
  /** Optional offer card placed after message `after` (0-based): title ≤ 10 字, note ≤ 18 字, price ≤ 10 个字符. */
  offer?: { after: number; image: PhotoImage; title: string; note: string; price?: string }
  /** 2–4 quick replies; clicking one sends `label` and, after a typing pause, the owner's `reply` (≤ 30 字). */
  quick?: { label: string; reply: string }[]
  /** ≤ 8 字. Default "写点什么…". */
  placeholder?: string
  source?: string
  hint?: string
}

/** A direct-message page as the close: the owner's profile on the left and a chat with an offer card on the right; quick-reply chips send a message and get a typed answer. Works in every style. */
export function DirectChat({
  profile,
  menu,
  active = 2,
  clock,
  status = '通常 1 小时内回复',
  messages,
  offer,
  quick = [],
  placeholder = '写点什么…',
  source,
  hint,
}: DirectChatProps) {
  const base = messages.slice(0, 5)
  const [extra, setExtra] = useState<DirectChatMessage[]>([])
  const [typing, setTyping] = useState(false)
  const [used, setUsed] = useState<number[]>([])
  const send = (i: number) => {
    if (typing || used.includes(i)) return
    const q = quick[i]
    setUsed((x) => [...x, i])
    setExtra((x) => [...x, { from: 'you', text: q.label }])
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setExtra((x) => [...x, { from: 'me', text: q.reply }])
    }, 1100)
  }
  const rows: { m?: DirectChatMessage; offer?: boolean; live?: boolean }[] = []
  base.forEach((m, i) => {
    rows.push({ m })
    if (offer && offer.after === i) rows.push({ offer: true })
  })
  extra.forEach((m) => rows.push({ m, live: true }))
  return (
    <section className="slide so">
      <Hint id="directchat">{hint}</Hint>
      <Reveal i={0} className="so-col so-col--side">
        <SoSide profile={profile} menu={menu} active={active} clock={clock} />
      </Reveal>
      <Reveal i={0.4} className="so-chat">
        <div className="so-chat__hd">
          <Avatar image={profile.avatar} size={56} />
          <span>
            <b>{profile.name}</b>
            <small>
              <i aria-hidden="true" />
              {status}
            </small>
          </span>
        </div>
        <div className="so-chat__list" data-crop>
          {rows.map((r, i) =>
            r.offer && offer ? (
              <div key={`o${i}`} className="so-offer" style={{ '--i': i } as CSSProperties}>
                <img src={offer.image.src} alt={offer.image.alt} draggable={false} style={{ objectPosition: offer.image.focus ?? 'center' }} />
                <span>
                  <b>{offer.title}</b>
                  <small>{offer.note}</small>
                  {offer.price && <em>{offer.price}</em>}
                </span>
              </div>
            ) : (
              <div key={i} className={`so-bub ${r.m?.from === 'me' ? 'is-me' : 'is-you'}${r.live ? ' is-live' : ''}`} style={{ '--i': i } as CSSProperties}>
                {r.m?.text}
              </div>
            ),
          )}
          {typing && (
            <div className="so-bub is-me is-typing is-live" aria-label="正在输入">
              <i />
              <i />
              <i />
            </div>
          )}
        </div>
        {quick.length > 0 && (
          <div className="so-quick">
            {quick.slice(0, 4).map((q, i) => (
              <button key={q.label} type="button" disabled={used.includes(i)} onClick={() => send(i)} style={{ '--i': i } as CSSProperties}>
                {q.label}
              </button>
            ))}
          </div>
        )}
        <div className="so-send is-big">
          {placeholder}
          <i aria-hidden="true">↑</i>
        </div>
      </Reveal>
      {source && (
        <div className="so-foot">
          <SlideFoot source={source} />
        </div>
      )}
    </section>
  )
}
