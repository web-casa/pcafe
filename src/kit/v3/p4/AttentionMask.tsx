import { useRef } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from '../../shared'
import { useStepCount } from '../../v2/p4/util'

export type MaskKind = 'full' | 'causal' | 'window' | 'sparse'

export interface MaskMode {
  /** ≤ 10 CJK characters. */
  label: string
  kind: MaskKind
  /** ≤ 40 CJK characters. */
  note: string
}

export interface AttentionMaskProps extends SlideBase {
  /** Grid size (tokens per side), 8–16. Default 12. */
  size?: number
  /** Local window width for 'window' and 'sparse', default 3. */
  window?: number
  /** Every n-th key stays visible in 'sparse' (global columns), default 4. */
  stride?: number
  /** 2–4 masks; each is a build step and replaces the grid. */
  modes: MaskMode[]
  /** Label over the grid, ≤ 12 CJK characters. Default '示意图'. */
  label?: string
}

function cell(kind: MaskKind, q: number, k: number, w: number, s: number) {
  if (kind === 'full') return true
  if (k > q) return false
  if (kind === 'causal') return true
  if (q - k < w) return true
  return kind === 'sparse' && k % s === 0
}

/** Query × key attention grid (illustration). Each step swaps the mask: full, causal, sliding window, sparse. */
export function AttentionMask({ kicker, title, lead, source, hint, size = 12, window = 3, stride = 4, modes, label = '示意图' }: AttentionMaskProps) {
  const ref = useRef<HTMLDivElement>(null)
  const k = Math.max(0, Math.min(modes.length, useStepCount(ref)) - 1)
  const m = modes[k]
  let lit = 0
  const cells = []
  for (let q = 0; q < size; q++)
    for (let c = 0; c < size; c++) {
      const on = cell(m.kind, q, c, window, stride)
      if (on) lit++
      cells.push(<i key={`${q}-${c}`} className={on ? 'is-on' : undefined} />)
    }
  return (
    <section className="slide">
      <Hint id="attn">{hint}</Hint>
      <div className="frame s-chart" ref={ref}>
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="attn">
          <figure className="attn__fig">
            <figcaption>
              <span>{label}</span>
              <b>
                {lit}/{size * size}
              </b>
            </figcaption>
            <div className="attn__grid" style={vars({ '--s': size })} aria-hidden>
              {cells}
            </div>
            <p className="attn__axis" aria-hidden>
              <span>key →</span>
              <span>query ↓</span>
            </p>
          </figure>
          <ol className="attn__modes">
            {modes.map((md, i) => (
              <li key={md.label} className={i === k ? 'is-on' : undefined} data-build={`attn-${i}`} data-step="">
                <b>{md.label}</b>
                <span>{md.note}</span>
              </li>
            ))}
          </ol>
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
