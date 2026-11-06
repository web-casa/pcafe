import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'

export interface BlockStat {
  /** ≤ 5 characters. */
  value: string
  /** Small unit after the value, ≤ 3 characters. */
  unit?: string
  /** ≤ 8 CJK characters. */
  label: string
  /** ≤ 24 CJK characters. */
  note: string
}

export interface BlockStatsProps extends SlideBase {
  /** 3–4 blocks; the first one is the focus and takes the accent colour. */
  stats: BlockStat[]
}

const TILT = [-1.6, 1.2, -0.8, 1.6]

/** Colour-block stat grid: 3–4 saturated blocks with thick black outlines and hard offset shadows, each holding one chunky number. */
export function BlockStats({ kicker, title, lead, source, hint, stats }: BlockStatsProps) {
  return (
    <section className="slide">
      <Hint id="blockstats">{hint}</Hint>
      <div className="frame s-pblocks">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="pblocks__row" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
          {stats.map((s, i) => (
            <Reveal key={s.label} i={3 + i} build>
              <div className={`pblock pblock--${i + 1}`} style={{ rotate: `${TILT[i % 4]}deg` }}>
                <span className="pblock__label">{s.label}</span>
                <b className="pblock__value">
                  {s.value}
                  {s.unit && <small>{s.unit}</small>}
                </b>
                <p className="pblock__note">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
