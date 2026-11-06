import { Reveal } from '../deck/primitives'
import type { Spot } from './parts'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export type BlockShape = 'circle' | 'square' | 'triangle' | 'star' | 'flower' | 'half'

export interface WordBlock {
  /** ≤ 6 CJK or 12 Latin characters. */
  word: string
  shape?: BlockShape
  spot?: Spot
}

export interface WordBlocksProps extends SlideBase {
  /** 4–10 blocks; they wrap like tags. */
  words: WordBlock[]
}

const SHAPES: Record<BlockShape, string> = {
  circle: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20Z',
  square: 'M3 3h18v18H3Z',
  triangle: 'M12 2.5 22 21H2Z',
  star: 'M12 1.5l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 8.7l7.1-.6Z',
  flower: 'M12 2a4 4 0 0 1 4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4-4Z',
  half: 'M2 18a10 10 0 0 1 20 0Z',
}
const ORDER: BlockShape[] = ['circle', 'star', 'square', 'flower', 'triangle', 'half']

/** Skills or topics as chunky colour blocks, each led by a small shape, wrapping like stickers on a page. */
export function WordBlocks({ kicker, title, lead, source, hint, words }: WordBlocksProps) {
  return (
    <section className="slide">
      <Hint id="wordblocks">{hint}</Hint>
      <div className="frame s-wordblocks">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <ul className="wordblocks">
          {words.map((w, i) => {
            const spot = w.spot ?? (((i % 6) + 1) as Spot)
            return (
              <Reveal key={w.word} build i={3 + i * 0.3} className={`wordblock wordblock--s${spot}`} style={{ rotate: `${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg` }}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d={SHAPES[w.shape ?? ORDER[i % ORDER.length]]} />
                </svg>
                {w.word}
              </Reveal>
            )
          })}
        </ul>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
