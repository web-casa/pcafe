import type { CSSProperties } from 'react'
import { Reveal } from '../../deck/primitives'
import { Icon, type IconName } from '../Icon'
import { Hint, SlideFoot } from '../shared'
import type { PhotoImage } from '../v2/p1/img'
import { Act, Avatar, Like, SoSide, Verified, type SocialClock, type SocialMenuItem, type SocialProfile } from './parts'

export interface SocialPostProps {
  profile: SocialProfile
  /** 4–6 menu items. */
  menu: SocialMenuItem[]
  active?: number
  clock?: SocialClock
  /** Back link above the post, ≤ 6 字. Default "动态". */
  back?: string
  /** e.g. "去年", ≤ 6 字. */
  time: string
  /** The announcement, 1–2 lines × ≤ 22 字, set large. */
  text: string[]
  /** One wide picture under the text. */
  image: PhotoImage
  /** e.g. ["12.8k", "932"]: likes and comments. */
  counts?: [string, string?]
  /** Right box of 2–3 facts: value ≤ 8 个字符, note ≤ 10 字. */
  facts?: { title: string; items: { icon: IconName; value: string; note: string }[] }
  /** Right box of 2–3 comments: name ≤ 6 字, text ≤ 16 字. */
  comments?: { title: string; items: { name: string; text: string; avatar: PhotoImage }[] }
  source?: string
  hint?: string
}

/** One big post as the news: a large two-line announcement with a wide picture and live like button, a box of launch facts and the top comments arriving on the right. Works in every style. */
export function SocialPost({ profile, menu, active = 3, clock, back = '动态', time, text, image, counts, facts, comments, source, hint }: SocialPostProps) {
  return (
    <section className="slide so">
      <Hint id="socialpost">{hint}</Hint>
      <Reveal i={0} className="so-col so-col--side">
        <SoSide profile={profile} menu={menu} active={active} clock={clock} />
      </Reveal>
      <Reveal i={0.4} className="so-col so-col--feed">
        <div className="so-feed" data-crop>
          <h4 className="so-feed__h">← {back}</h4>
          <article className="so-post is-big">
            <Avatar image={profile.avatar} size={52} />
            <div>
              <div className="so-who">
                <b>{profile.name}</b>
                <Verified />
                <span>· {time}</span>
              </div>
              <p className="so-post__text is-big">
                {text.slice(0, 2).map((l, i) => (
                  <span key={i}>{l}</span>
                ))}
              </p>
              <div className="so-media is-wide" data-crop>
                <img src={image.src} alt={image.alt} draggable={false} style={{ objectPosition: image.focus ?? 'center' }} />
              </div>
              <div className="so-acts">
                <Like count={counts?.[0]} />
                {counts?.[1] && <Act kind="comment">评论 {counts[1]}</Act>}
                <Act kind="share">分享</Act>
              </div>
            </div>
          </article>
        </div>
      </Reveal>
      <div className="so-col so-col--rail">
        {facts && (
          <Reveal i={0.9} className="so-box">
            <h5>{facts.title}</h5>
            {facts.items.slice(0, 3).map((f, i) => (
              <div key={i} className="so-item is-fact" style={{ '--i': i } as CSSProperties}>
                <i>
                  <Icon name={f.icon} size={26} tone="accent" />
                </i>
                <span>
                  <b>{f.value}</b>
                  <small>{f.note}</small>
                </span>
              </div>
            ))}
          </Reveal>
        )}
        {comments && (
          <Reveal i={1.3} className="so-box">
            <h5>{comments.title}</h5>
            {comments.items.slice(0, 3).map((c, i) => (
              <div key={i} className="so-item is-comment" style={{ '--i': i } as CSSProperties}>
                <img src={c.avatar.src} alt={c.avatar.alt} draggable={false} style={{ objectPosition: c.avatar.focus ?? 'center' }} />
                <span>
                  <b>{c.name}</b>
                  <small>{c.text}</small>
                </span>
              </div>
            ))}
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
