import type { AgendaState, Session, TimeWindow } from './types'

// Pure time logic, no React. Everything is wall-clock minutes on the screen's own clock,
// so a daylight-saving change or an NTP correction cannot desynchronise a schedule.

export interface Parts {
  y: number
  mo: number
  d: number
  h: number
  mi: number
  s: number
  /** 0 = Sunday. */
  dow: number
  /** Minutes since midnight. */
  minutes: number
  /** YYYY-MM-DD. */
  date: string
}

const p2 = (n: number) => String(n).padStart(2, '0')

// One formatter per zone for the life of the page: a new Intl object per tick would be the
// easiest memory growth to create by accident.
const formatters = new Map<string, Intl.DateTimeFormat>()
function fmt(tz: string) {
  let f = formatters.get(tz)
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', weekday: 'short' })
    formatters.set(tz, f)
  }
  return f
}
const DOW: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

export function partsOf(ms: number, tz?: string): Parts {
  let y: number, mo: number, d: number, h: number, mi: number, s: number, dow: number
  if (tz) {
    const out: Record<string, string> = {}
    for (const p of fmt(tz).formatToParts(ms)) out[p.type] = p.value
    y = +out.year; mo = +out.month; d = +out.day; h = +out.hour % 24; mi = +out.minute; s = +out.second; dow = DOW[out.weekday] ?? 0
  } else {
    const t = new Date(ms)
    y = t.getFullYear(); mo = t.getMonth() + 1; d = t.getDate(); h = t.getHours(); mi = t.getMinutes(); s = t.getSeconds(); dow = t.getDay()
  }
  return { y, mo, d, h, mi, s, dow, minutes: h * 60 + mi, date: `${y}-${p2(mo)}-${p2(d)}` }
}

export function minutesOf(hhmm: string) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm)
  if (!m) throw new Error(`bad time "${hhmm}", expected HH:MM`)
  return +m[1] * 60 + +m[2]
}

/** The instant a wall-clock time happens in a zone. Used only for ?now=. */
export function instantOf(wall: string, tz?: string, today = Date.now()): number {
  const base = /^\d{1,2}:\d{2}/.test(wall) ? `${partsOf(today, tz).date}T${wall.padStart(5, '0')}` : wall
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(base)
  if (!m) throw new Error(`bad ?now= "${wall}", expected HH:MM or YYYY-MM-DDTHH:MM[:SS]`)
  const [y, mo, d, h, mi, s] = [+m[1], +m[2], +m[3], +m[4], +m[5], +(m[6] ?? 0)]
  if (!tz) return new Date(y, mo - 1, d, h, mi, s).getTime()
  const want = Date.UTC(y, mo - 1, d, h, mi, s)
  let t = want
  for (let k = 0; k < 3; k++) {
    const p = partsOf(t, tz)
    t += want - Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s)
  }
  return t
}

function matchOne(w: TimeWindow, p: Parts) {
  const from = minutesOf(w.from)
  const to = minutesOf(w.to)
  const cross = from > to
  const inside = cross ? p.minutes >= from || p.minutes < to : p.minutes >= from && p.minutes < to
  if (!inside) return false
  // After midnight in a crossing window, the day that counts is the one it started on.
  const startedYesterday = cross && p.minutes < to
  const dow = startedYesterday ? (p.dow + 6) % 7 : p.dow
  if (w.days && !w.days.includes(dow)) return false
  if (w.dates) {
    const date = startedYesterday ? previousDate(p) : p.date
    if (!w.dates.includes(date)) return false
  }
  return true
}

function previousDate(p: Parts) {
  const t = new Date(Date.UTC(p.y, p.mo - 1, p.d) - 86400000)
  return `${t.getUTCFullYear()}-${p2(t.getUTCMonth() + 1)}-${p2(t.getUTCDate())}`
}

export function inWindow(when: TimeWindow | TimeWindow[] | undefined, p: Parts) {
  if (!when) return true
  return (Array.isArray(when) ? when : [when]).some((w) => matchOne(w, p))
}

export function agendaState(sessions: Session[], p: Parts, seconds = p.s): AgendaState {
  const today = sessions
    .filter((s) => !s.date || s.date === p.date)
    .map((s) => ({ s, a: minutesOf(s.start), b: minutesOf(s.end) }))
    .sort((x, y) => x.a - y.a)
  const list = today.map((t) => t.s)
  if (!today.length) return { phase: 'empty', now: null, next: null, toNext: null, left: null, progress: 0, today: list }
  const t = p.minutes + seconds / 60
  const cur = today.find((x) => t >= x.a && t < x.b)
  const nxt = today.find((x) => x.a > t)
  const toNext = nxt ? Math.ceil(nxt.a - t) : null
  if (cur) {
    return { phase: 'during', now: cur.s, next: nxt?.s ?? null, toNext, left: Math.ceil(cur.b - t), progress: (t - cur.a) / (cur.b - cur.a), today: list }
  }
  const phase = t < today[0].a ? 'before' : nxt ? 'gap' : 'after'
  return { phase, now: null, next: nxt?.s ?? null, toNext, left: null, progress: 0, today: list }
}

// ---- the clock ----

export interface Clock {
  speed: number
  /** Epoch ms on the screen's clock (real, unless ?now= or ?speed= is set). */
  now(): number
  /** Monotonic ms, scaled by speed. Dwell times use this, so a clock change never skips or freezes a scene. */
  mono(): number
}

export function createClock(startAt: number | null, speed: number): Clock {
  const p0 = performance.now()
  const w0 = startAt ?? Date.now()
  const virtual = startAt !== null || speed !== 1
  return {
    speed,
    now: virtual ? () => w0 + (performance.now() - p0) * speed : () => Date.now(),
    mono: () => performance.now() * speed,
  }
}

/** Reading time for text: research §3. Numbers and Latin words count as one word each. */
export function countWords(text: string) {
  const cjk = (text.match(/[㐀-鿿豈-﫿]/g) ?? []).length
  const words = (text.replace(/[㐀-鿿豈-﫿]/g, ' ').match(/[A-Za-z0-9][A-Za-z0-9.,:'’\-]*/g) ?? []).length
  return { cjk, words }
}

export const CJK_PER_SECOND = 260 / 60
export const WORDS_PER_SECOND = 238 / 60
export const ORIENT_SECONDS = 2

export function readingSeconds(text: string) {
  const { cjk, words } = countWords(text)
  return ORIENT_SECONDS + cjk / CJK_PER_SECOND + words / WORDS_PER_SECOND
}
