// Slide backdrops (DeckDef.backdrop, SlideDef.backdrop). A layer behind the
// slide content, coloured only from theme tokens. Pure CSS + inline SVG, no
// assets. Animated ones move slowly and stop for reduced motion and print.

export type Backdrop = 'none' | 'dots' | 'mesh' | 'paper' | 'particles' | 'grid'

// Deterministic pseudo-random particle field (same on every render / export).
function particles() {
  let s = 7
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  return Array.from({ length: 110 }, () => ({ x: r() * 1920, y: r() * 1080, rad: 1.2 + r() * r() * 4.5, o: 0.25 + r() * 0.6, a: r() < 0.22 }))
}
const DOTS = particles()

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`

/** Decorative layer under the slide frame. aria-hidden, pointer-transparent, never holds text. */
export function BackdropLayer({ backdrop }: { backdrop?: Backdrop }) {
  if (!backdrop || backdrop === 'none') return null
  return (
    <div className="backdrop-layer" data-backdrop={backdrop} data-crop aria-hidden>
      {backdrop === 'mesh' && (
        <>
          <i className="bd-blob bd-blob--1" />
          <i className="bd-blob bd-blob--2" />
          <i className="bd-blob bd-blob--3" />
          <i className="bd-blob bd-blob--4" />
        </>
      )}
      {backdrop === 'paper' && <i className="bd-grain" style={{ backgroundImage: GRAIN }} />}
      {backdrop === 'grid' && (
        <>
          <i className="bd-grid bd-grid--a" />
          <i className="bd-grid bd-grid--b" />
        </>
      )}
      {backdrop === 'particles' && (
        <svg className="bd-particles" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          {[0, 1].map((g) => (
            <g key={g} className={`bd-pgroup bd-pgroup--${g}`}>
              {DOTS.filter((_, k) => k % 2 === g).map((d, k) => (
                <circle key={k} cx={d.x} cy={d.y} r={d.rad} opacity={d.o} className={d.a ? 'is-accent' : undefined} />
              ))}
            </g>
          ))}
        </svg>
      )}
    </div>
  )
}
