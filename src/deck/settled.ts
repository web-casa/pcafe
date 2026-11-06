// Publishes `data-settled` on the current slide frame once its entrance and
// build motion has finished, so tests wait for a real signal instead of a
// fixed delay.
//
// Only tests ask for the signal: Playwright sets `navigator.webdriver`, and a
// manual check can add `?settle` to the URL. Without one of those, nothing here
// runs and no attribute is written.
//
// Animation sources the engine uses and how each one is covered:
// - CSS animations and transitions, and WAAPI animations: every *finite*
//   animation in the deck subtree is awaited through Animation.finished. Very
//   long ambient moves (a full-bleed photo push-in) are ignored like loops; QA
//   pins all of them for screenshots.
//   Infinite decorative loops (marquee, orbit, blink, drifting backdrops) never
//   finish, so they are ignored here; QA keeps those screenshots deterministic
//   with its own phase hold.
// - `motion` transitions and springs, counters (chart-util, BeforeAfter) and
//   SVG draws: they change text, attributes or inline styles on every frame,
//   so a quiet window on the deck subtree covers them.
// - Large images: decoded before the frame reports settled, so a screenshot
//   never catches a half-decoded photo.
// - Shared-element morph ghosts: the frame only settles after they are removed.
// - Web fonts: the frame only settles after document.fonts.ready.
// A slide whose animation never ends never closes the quiet window, so the
// frame never reports settled and QA fails on its settle timeout. A genuinely
// live element (a clock) can opt out with `data-settle-ignore`.

const QUIET_MS = 120
/** A loop only gives up on the quiet window for this long before re-checking. */
const QUIET_CAP_MS = 2500
/** Never wait longer than this for one image; a broken image settles and is reported elsewhere. */
const IMAGE_WAIT_MS = 2000

const IGNORE = '[data-settle-ignore]'
/** A longer finite move is ambient (photo push-in), not an entrance: do not wait for it. */
const LONG_ANIMATION_MS = 5000

const twoFrames = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))

/** True when a test asked for the settle signal. */
export const settleEnabled = () =>
  typeof navigator !== 'undefined' && (navigator.webdriver === true || new URLSearchParams(location.search).has('settle'))

/** Clear the marker before a slide or build step changes; no-op when the signal is off. */
export function markUnsettled(el: HTMLElement | null) {
  if (el && settleEnabled()) el.dataset.settled = 'false'
}

const isFiniteAnimation = (a: Animation) => {
  const timing = a.effect?.getComputedTiming?.()
  return a.playState === 'running' && !!timing && Number.isFinite(timing.endTime ?? Infinity)
}

const runningAnimations = (root: HTMLElement) =>
  typeof root.getAnimations === 'function'
    ? root
        .getAnimations({ subtree: true })
        .filter(isFiniteAnimation)
        .filter((a) => Number(a.effect?.getComputedTiming?.().endTime ?? 0) <= LONG_ANIMATION_MS)
    : []

/** A mutation inside `data-settle-ignore` is a live element and never resets the quiet window. */
const ignoredMutation = (target: Node) => {
  const el = target.nodeType === 1 ? (target as Element) : target.parentElement
  return !!el?.closest(IGNORE)
}

/** Resolves true after `ms` with no DOM/style change in the subtree, false when the cap is hit. */
function quietFor(root: HTMLElement, ms: number) {
  return new Promise<boolean>((resolve) => {
    let quietTimer = 0
    let capTimer = 0
    const finish = (quiet: boolean) => {
      observer.disconnect()
      clearTimeout(quietTimer)
      clearTimeout(capTimer)
      resolve(quiet)
    }
    const observer = new MutationObserver((records) => {
      if (records.every((r) => ignoredMutation(r.target))) return
      clearTimeout(quietTimer)
      quietTimer = window.setTimeout(() => finish(true), ms)
    })
    observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true })
    quietTimer = window.setTimeout(() => finish(true), ms)
    capTimer = window.setTimeout(() => finish(false), ms + QUIET_CAP_MS)
  })
}

/** Wait until the image has pixels (or failed); a broken image settles, the image checks report it. */
function imageReady(img: HTMLImageElement) {
  return new Promise<void>((resolve) => {
    let timer = 0
    const done = () => {
      clearTimeout(timer)
      img.removeEventListener('load', done)
      img.removeEventListener('error', done)
      resolve()
    }
    if (img.complete) return done()
    img.addEventListener('load', done)
    img.addEventListener('error', done)
    timer = window.setTimeout(done, IMAGE_WAIT_MS)
  })
}

async function imagesReady(frame: HTMLElement) {
  await Promise.all(
    [...frame.querySelectorAll('img')].map(async (img) => {
      await imageReady(img)
      try {
        await img.decode?.()
      } catch {
        /* broken image: the existing broken-image checks report it */
      }
    }),
  )
}

/**
 * Watch one slide frame until it has settled. Returns a cleanup function; a new
 * frame or build step calls the cleanup and starts a fresh watch.
 */
export function settleWhenIdle(root: HTMLElement, frame: HTMLElement) {
  if (!settleEnabled()) {
    delete frame.dataset.settled
    return () => {}
  }
  let cancelled = false
  const run = async () => {
    frame.dataset.settled = 'false'
    while (!cancelled) {
      await (document.fonts?.ready ?? Promise.resolve()).catch(() => undefined)
      if (cancelled) return
      const frames = frame.parentElement ? [...frame.parentElement.children].filter((c) => c.classList.contains('slide-frame')) : []
      if (frames.length > 1 || document.querySelector('.morph-ghost')) {
        await twoFrames()
        continue
      }
      const animations = runningAnimations(root)
      if (animations.length) {
        await Promise.all(animations.map((a) => a.finished.catch(() => undefined)))
        continue
      }
      await imagesReady(frame)
      if (cancelled) return
      if (!(await quietFor(root, QUIET_MS))) continue
      // An animation that started during the quiet window must finish too.
      if (runningAnimations(root).length) continue
      if (!cancelled) frame.dataset.settled = 'true'
      return
    }
  }
  void run()
  return () => {
    cancelled = true
  }
}
