import { vars } from '../../shared'
/** Decorative waveform: deterministic bar heights, the first `played` share drawn in the accent. */
export function Wave({ bars = 48, played = 0.4, seed = 1 }: { bars?: number; played?: number; seed?: number }) {
  return (
    <span className="fu-wave" aria-hidden>
      {Array.from({ length: bars }, (_, i) => {
        const h = 0.22 + 0.78 * Math.abs(Math.sin(i * 0.61 * seed + 1.3) * Math.cos(i * 0.23 + seed))
        return <i key={i} className={i / bars < played ? 'is-on' : undefined} style={vars({ '--h': h.toFixed(2) })} />
      })}
    </span>
  )
}
