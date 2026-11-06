// Pure functions of time. A portrait part computes every value from useSceneTime(), so it can be
// drawn at any frame with no animation state at all.

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Progress of a stretch that starts at `at` and lasts `dur` seconds. */
export const span = (t: number, at: number, dur: number) => clamp01((t - at) / dur)

export const easeOut = (p: number) => 1 - (1 - p) ** 3
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2)
/** Fast out, long settle: the same feel as the kit's EASE_OUT curve. */
export const expoOut = (p: number) => (p >= 1 ? 1 : 1 - 2 ** (-10 * p))

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p

/** Fade and lift in. Returns inline styles for a block entering at `at`. */
export function enter(t: number, at = 0, dur = 0.55, lift = 26) {
  const p = expoOut(span(t, at, dur))
  return { opacity: span(t, at, dur * 0.7), transform: `translateY(${(1 - p) * lift}px)` }
}
