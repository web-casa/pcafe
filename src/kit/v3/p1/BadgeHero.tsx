import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type SlideBase } from '../../shared'
import type { PhotoImage } from '../../v2/p1/img'
import { D1Buttons, type D1Action } from './util'

export interface BadgeHeroProps extends Omit<SlideBase, 'source'> {
  /** Text in the pill badge after the kicker, ≤ 18 字. */
  badge?: string
  /** 1–2 buttons. */
  actions?: D1Action[]
  /** Wide image shown in a window that rises from the bottom edge (decor- illustration or real screenshot). */
  image: PhotoImage
  /** Small line under the buttons, ≤ 30 字. */
  note?: string
}

/** Centered landing-page hero: pill badge, big title, lead, buttons, and an image window rising from the bottom. */
export function BadgeHero({ kicker, title, lead, badge, actions, image, note, hint }: BadgeHeroProps) {
  return (
    <section className="slide">
      <Hint id="badgehero">{hint}</Hint>
      <div className="frame d1hero">
        <Reveal i={0} className="d1hero__badge">
          <span className="d1hero__kicker">{kicker}</span>
          {badge && <span className="d1hero__badge-text">{badge}</span>}
        </Reveal>
        <Reveal i={1}>
          <h1 className="d1hero__title">
            <Lines text={title} />
          </h1>
        </Reveal>
        {lead && (
          <Reveal i={2}>
            <p className="d1hero__lead">{lead}</p>
          </Reveal>
        )}
        <Reveal i={3}>
          <D1Buttons actions={actions} />
        </Reveal>
        {note && (
          <Reveal i={4}>
            <p className="d1hero__note">{note}</p>
          </Reveal>
        )}
      </div>
      <Reveal i={5} y={80} className="d1hero__win">
        <div className="d1hero__bar" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <figure className="d1hero__img" data-crop>
          <img src={image.src} alt={image.alt} draggable={false} style={{ objectPosition: image.focus ?? 'center top' }} />
        </figure>
        {image.credit && <p className="d1hero__credit">{image.credit}</p>}
      </Reveal>
    </section>
  )
}
