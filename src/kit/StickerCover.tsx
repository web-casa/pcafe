import { Reveal } from '../deck/primitives'
import { Polaroid, Scribble, SelectBox, Sticker } from './decor'
import { Pill, type Spot } from './parts'
import { Hint, Lines, vars, type Text } from './shared'

export interface StickerCoverProps {
  /** ≤ 2 lines × 8 CJK characters; the last line sits in a selection box. */
  title: Text
  /** ≤ 50 CJK characters. */
  lead: string
  /** 2–4 stickers scattered round the title, each ≤ 8 CJK characters. */
  stickers: { text: string; spot?: Spot }[]
  /** Handwritten note pointing at the title, ≤ 12 CJK characters. */
  note?: string
  /** A real screenshot as an instant photo on the right. */
  shot?: { src: string; alt: string; caption?: string; file?: string }
  /** 1–2 pills under the lead. */
  pills?: string[]
  hint?: string
}

const SLOTS = [
  { top: 90, left: 980, tilt: 6, pointer: true },
  { top: 690, left: 760, tilt: -5, pointer: false },
  { top: 790, left: 1040, tilt: 4, pointer: true },
  { top: 40, left: 520, tilt: -3, pointer: false },
]

/** Cover on grid paper: the title in a selection box, stickers around it, an instant photo of the product. */
export function StickerCover({ title, lead, stickers, note, shot, pills = [], hint }: StickerCoverProps) {
  const lines = typeof title === 'string' ? [title] : title
  return (
    <section className="slide">
      <Hint id="stickercover">{hint}</Hint>
      <div className={`frame s-stcover${shot ? ' has-shot' : ''}`}>
        <div className="stcover__copy">
          {note && (
            <Reveal i={3} className="stcover__note">
              <Scribble text={note} />
            </Reveal>
          )}
          <Reveal i={1}>
            <h1 className="cover__title stcover__title">
              {lines.slice(0, -1).map((l) => (
                <span key={l} className="stcover__line">
                  {l}
                </span>
              ))}
              <SelectBox>
                <span className="stcover__line">{lines[lines.length - 1]}</span>
              </SelectBox>
            </h1>
          </Reveal>
          <Reveal i={2} className="stcover__lead">
            <Lines text={lead} />
          </Reveal>
          {pills.length > 0 && (
            <Reveal i={3} className="stcover__pills">
              {pills.map((p, i) => (
                <Pill key={p} tone={i ? 'line' : 'solid'}>
                  {p}
                </Pill>
              ))}
            </Reveal>
          )}
        </div>
        {shot && (
          <Reveal i={2} y={40} className="stcover__shot">
            <Polaroid src={shot.src} alt={shot.alt} caption={shot.caption} file={shot.file} tilt={4} />
          </Reveal>
        )}
        <div className="stcover__stickers">
          {stickers.slice(0, 4).map((s, i) => (
            <Reveal key={s.text} i={4 + i * 0.4} className="stcover__sticker" style={vars({ '--top': SLOTS[i].top, '--left': SLOTS[i].left })}>
              <Sticker spot={s.spot ?? ([5, 2, 4, 3] as const)[i]} tilt={SLOTS[i].tilt} pointer={SLOTS[i].pointer}>
                {s.text}
              </Sticker>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
