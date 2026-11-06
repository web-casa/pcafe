import { Kicker, Reveal } from '../deck/primitives'
import type { IconName } from './Icon'
import { IconTile, type Spot } from './parts'
import { Hint, SlideFoot, vars } from './shared'

export interface SplitCard {
  /** Short label in an outlined pill, ≤ 8 CJK characters. */
  label: string
  /** A real screenshot. Without it the card is a colour block with an icon. */
  src?: string
  alt?: string
  icon?: IconName
  spot?: Spot
}

export interface SplitWordProps {
  kicker: string
  /** Two giant words: the first sits top-left, the second bottom-right. Each ≤ 6 CJK or 10 Latin characters. */
  words: [string, string]
  /** 2–3 cards fanned out between the two words. */
  cards: SplitCard[]
  /** One line under the second word, ≤ 30 CJK characters. */
  lead?: string
  source?: string
  hint?: string
}

const FAN = [
  { r: -9, x: -250, y: 20 },
  { r: 0, x: 0, y: -10 },
  { r: 9, x: 250, y: 20 },
]

/** Cover: two giant words cut through by a fan of cards. */
export function SplitWord({ kicker, words, cards, lead, source, hint }: SplitWordProps) {
  const fan = cards.length === 2 ? [FAN[0], FAN[2]] : FAN
  return (
    <section className="slide">
      <Hint id="split">{hint}</Hint>
      <div className="frame s-split">
        <Reveal i={0} className="split__kicker">
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1} className="split__word split__word--a">
          <h1 className="cover__title">{words[0]}</h1>
        </Reveal>
        <div className="split__fan" aria-hidden={!cards.some((c) => c.src)}>
          {cards.slice(0, 3).map((c, i) => (
            <div key={c.label} className={`split__card${c.src ? ' has-img' : ''}`} style={vars({ '--r': `${fan[i].r}deg`, '--x': fan[i].x, '--y': fan[i].y, '--c': `var(--spot-${c.spot ?? i + 1})`, '--k': i })}>
              {c.src ? <img src={c.src} alt={c.alt ?? ''} draggable={false} /> : c.icon && <IconTile icon={c.icon} spot={c.spot ?? ((i + 1) as Spot)} size={120} className="split__tile" />}
              <span className="split__pill">{c.label}</span>
            </div>
          ))}
        </div>
        <Reveal i={2} className="split__word split__word--b">
          <span className="cover__title">{words[1]}</span>
        </Reveal>
        {lead && (
          <Reveal i={3} className="split__lead">
            {lead}
          </Reveal>
        )}
        <SlideFoot source={source} i={6} />
      </div>
    </section>
  )
}
