// Plain JavaScript so it can ship in the `pcafe/vite` export (see vite.emoji.mjs).
// `120u` in CSS becomes calc(120 * var(--u)). 1u is one pixel of the 1920×1080
// design canvas; Stage sets --u from the viewport, so nothing is ever scaled
// with a CSS transform (which would break shared-layout measurements).
export const designUnit = {
  postcssPlugin: 'design-unit',
  Declaration(decl) {
    if (!/\du\b/.test(decl.value)) return
    decl.value = decl.value.replace(
      /(^|[\s(,/*+])(-?\d*\.?\d+)u\b/g,
      (_m, lead, n) => `${lead}calc(${n} * var(--u))`,
    )
  },
}
