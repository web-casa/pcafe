import { useState, type CSSProperties } from 'react'
import { Reveal } from '../../deck/primitives'
import { Icon, type IconName } from '../Icon'
import { Hint, SlideFoot } from '../shared'
import type { PhotoImage } from '../v2/p1/img'
import { Act, Avatar, Like, SoSide, Verified, type SocialClock, type SocialMenuItem, type SocialProfile } from './parts'

export interface SocialFeedPost {
  /** ≤ 34 字. */
  text: string
  /** e.g. "7 个月前", ≤ 6 字. */
  time: string
  pinned?: boolean
  /** 0–2 pictures, only on the first post; two sit side by side. */
  media?: PhotoImage[]
  /** e.g. "2.3k". */
  likes?: string
}

export interface SocialFeedRailItem {
  /** ≤ 12 字. */
  title: string
  /** ≤ 10 字. */
  note: string
  image?: PhotoImage
  icon?: IconName
}

export interface SocialFeedProps {
  profile: SocialProfile
  /** 4–6 menu items. */
  menu: SocialMenuItem[]
  active?: number
  clock?: SocialClock
  /** Column heading, ≤ 6 字. Default "动态". */
  heading?: string
  /** 2–3 posts, newest (or pinned) first; only the first shows pictures. */
  posts: SocialFeedPost[]
  /** 0–4 story rings, label ≤ 3 字. */
  stories?: { label: string; image: PhotoImage }[]
  /** 0–2 small boxes on the right, each with 2 items. */
  boxes?: { title: string; items: SocialFeedRailItem[] }[]
  /** Blue bubble at the bottom of the rail, ≤ 26 字. */
  say?: string
  /** Placeholder in the message box, ≤ 8 字. Default "发消息…". */
  placeholder?: string
  source?: string
  hint?: string
}

/** A personal page set as a social feed: profile and menu on the left, a column of posts in the middle (the first with pictures, likes that toggle), stories and small boxes on the right. Works in every style. */
export function SocialFeed({ profile, menu, active = 0, clock, heading = '动态', posts, stories = [], boxes = [], say, placeholder = '发消息…', source, hint }: SocialFeedProps) {
  const [seen, setSeen] = useState<number[]>([])
  return (
    <section className="slide so">
      <Hint id="socialfeed">{hint}</Hint>
      <Reveal i={0} className="so-col so-col--side">
        <SoSide profile={profile} menu={menu} active={active} clock={clock} />
      </Reveal>
      <Reveal i={0.4} className="so-col so-col--feed">
        <div className="so-feed" data-crop>
          <h4 className="so-feed__h">{heading}</h4>
          {posts.slice(0, 3).map((p, i) => (
            <article key={i} className="so-post" style={{ '--i': i } as CSSProperties}>
              <Avatar image={profile.avatar} size={52} />
              <div>
                <div className="so-who">
                  <b>{profile.name}</b>
                  <Verified />
                  <span>· {p.time}</span>
                  {p.pinned && <em>置顶</em>}
                </div>
                <p className="so-post__text">{p.text}</p>
                {i === 0 && p.media && p.media.length > 0 && (
                  <div className={p.media.length > 1 ? 'so-media is-two' : 'so-media'} data-crop>
                    {p.media.slice(0, 2).map((m, k) => (
                      <img key={k} src={m.src} alt={m.alt} draggable={false} style={{ objectPosition: m.focus ?? 'center' }} />
                    ))}
                  </div>
                )}
                <div className="so-acts">
                  <Like count={p.likes} />
                  <Act kind="share">分享</Act>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
      <div className="so-col so-col--rail">
        {stories.length > 0 && (
          <Reveal i={0.8} className="so-stories">
            {stories.slice(0, 4).map((s, i) => (
              <button key={i} type="button" className={seen.includes(i) ? 'is-seen' : undefined} onClick={() => setSeen((x) => (x.includes(i) ? x : [...x, i]))}>
                <Avatar image={s.image} size={84} ring />
                {s.label}
              </button>
            ))}
          </Reveal>
        )}
        {boxes.slice(0, 2).map((b, i) => (
          <Reveal key={i} i={1.1 + i * 0.3} className="so-box">
            <h5>
              {b.title}
              <span aria-hidden="true">→</span>
            </h5>
            {b.items.slice(0, 2).map((it, k) => (
              <div key={k} className="so-item">
                {it.image ? (
                  <img src={it.image.src} alt={it.image.alt} draggable={false} style={{ objectPosition: it.image.focus ?? 'center' }} />
                ) : (
                  <i>{it.icon && <Icon name={it.icon} size={26} tone="accent" />}</i>
                )}
                <span>
                  <b>{it.title}</b>
                  <small>{it.note}</small>
                </span>
              </div>
            ))}
          </Reveal>
        ))}
        {say && (
          <Reveal i={1.8} className="so-box so-say">
            <div className="so-bub is-me">{say}</div>
            <div className="so-send">
              {placeholder}
              <i aria-hidden="true">↑</i>
            </div>
          </Reveal>
        )}
      </div>
      {source && (
        <div className="so-foot">
          <SlideFoot source={source} />
        </div>
      )}
    </section>
  )
}
