export type Texture = 'none' | 'grain' | 'paper' | 'noise-dark'

// Paper is one stage-sized tile (anisotropic noise does not stitch seamlessly).
// Generated offline: inline SVG feTurbulence tiles, no network, no assets.
const svg = (freq: number | string, octaves: number, matrix: string, size = 240, h = size) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${h}'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' stitchTiles='stitch'/><feColorMatrix values='${matrix}'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  )}")`

// Grey grain: luminance-ish noise into all channels, full alpha.
// Contrast-stretched grey noise (R channel x3, centred), opaque.
const STRETCH = '3 0 0 0 -1  3 0 0 0 -1  3 0 0 0 -1  0 0 0 0 1'
const TILES: Record<Exclude<Texture, 'none'>, string> = {
  grain: svg(0.9, 2, STRETCH),
  paper: svg('0.025 0.2', 4, STRETCH, 1920, 1080),
  'noise-dark': svg(1.2, 1, STRETCH, 160),
}

/** Fixed, pointer-transparent texture over the stage. Decorative only: aria-hidden, no text. */
export function TextureLayer({ texture }: { texture: Texture }) {
  if (!texture || texture === 'none') return null
  return <div className="texture-layer" data-texture={texture} aria-hidden style={{ backgroundImage: TILES[texture] }} />
}
