// Content rules. Anything broken here is a FAIL in scripts/course-qa.mjs, and the problems are
// also printed to the console, so an author sees them in the dev server.
import { clozeBlanks, matchChips } from './grade'
import type { CourseDef, Exercise, Step } from './types'

/** Length budgets in characters, so a phone screen stays readable. */
export const LIMITS = {
  title: 26,
  prompt: 90,
  option: 70,
  why: [10, 110],
  statement: 70,
  card: 90,
  task: 44,
  blocks: 6,
} as const

export const allSteps = (c: CourseDef): Step[] => c.sections.flatMap((s) => s.steps)

/** Characters a reader sees: inline markup does not count. */
export function visibleLength(s: string) {
  return s.replace(/[*`]/g, '').length
}

export function validate(c: CourseDef): string[] {
  const out: string[] = []
  const steps = allSteps(c)
  const ids = new Set<string>()
  const say = (id: string, m: string) => out.push(`${id}: ${m}`)

  for (const s of steps) {
    if (ids.has(s.id)) say(s.id, 'duplicate step id')
    ids.add(s.id)
    if (s.kind !== 'practice' && visibleLength(s.title) > LIMITS.title) say(s.id, `title over ${LIMITS.title} characters`)
    if (s.kind === 'read') {
      if (!s.cites.length && !s.illustrative) say(s.id, 'a read step needs cites, or illustrative: true if it states no outside fact')
      if (s.blocks.length > LIMITS.blocks) say(s.id, `more than ${LIMITS.blocks} blocks: split the step`)
    } else if (!s.cites.length) {
      say(s.id, 'needs cites')
    }
    for (const key of s.cites) if (!c.sources[key]) say(s.id, `cites "${key}", which is not in sources`)
    if (s.kind !== 'read' && !c.concepts[s.concept]) say(s.id, `unknown concept "${s.concept}"`)
    if (s.kind === 'practice') exercise(s.id, s.exercise, say)
    if (s.kind === 'lab') {
      if (!s.simulation.trim()) say(s.id, 'a lab must say that it is a simulation')
      if (!s.tasks.length) say(s.id, 'a lab needs tasks: exploration without goals teaches little')
      if (!s.solve.length) say(s.id, 'a lab needs a scripted solve for QA')
      for (const t of s.tasks) {
        if (visibleLength(t.text) > LIMITS.task) say(s.id, `task "${t.id}" over ${LIMITS.task} characters`)
        why(s.id, t.why, say)
      }
    }
  }
  for (const [key, concept] of Object.entries(c.concepts)) {
    if (!ids.has(concept.review)) say(`concept ${key}`, `review step "${concept.review}" does not exist`)
    if (!steps.some((s) => s.kind !== 'read' && s.concept === key)) say(`concept ${key}`, 'no exercise tests it')
  }
  if (!steps.some((s) => s.kind === 'practice' && !s.pretest && s.exercise.type !== 'flashcards')) out.push('course: nothing is scored')
  if (!Object.keys(c.sources).length) out.push('course: empty source list')
  for (const [key, source] of Object.entries(c.sources)) if (!source.org || !source.title) say(`source ${key}`, 'needs org and title')
  return out
}

type Say = (id: string, m: string) => void

function why(id: string, text: string, say: Say) {
  const n = visibleLength(text ?? '')
  if (n < LIMITS.why[0]) say(id, `feedback too short to explain anything: "${text ?? ''}"`)
  if (n > LIMITS.why[1]) say(id, `feedback over ${LIMITS.why[1]} characters: "${text.slice(0, 20)}…"`)
}

function exercise(id: string, ex: Exercise, say: Say) {
  const prompt = ex.type === 'truefalse' ? ex.statement : ex.prompt
  const max = ex.type === 'truefalse' ? LIMITS.statement : LIMITS.prompt
  if (visibleLength(prompt) > max) say(id, `prompt over ${max} characters`)
  switch (ex.type) {
    case 'single':
    case 'multi': {
      const right = ex.options.filter((o) => o.correct).length
      if (ex.type === 'single' && right !== 1) say(id, `single choice needs exactly one correct option, has ${right}`)
      if (ex.type === 'multi' && (right < 1 || right === ex.options.length)) say(id, 'multiple choice needs both correct and wrong options')
      if (ex.options.length < 3) say(id, 'needs at least 3 options')
      if (ex.options.length > 6) say(id, 'more than 6 options')
      if (new Set(ex.options.map((o) => o.text)).size !== ex.options.length) say(id, 'duplicate options')
      if (new Set(ex.options.map((o) => o.why)).size !== ex.options.length) say(id, 'every option needs its own explanation')
      for (const o of ex.options) {
        if (visibleLength(o.text) > LIMITS.option) say(id, `option over ${LIMITS.option} characters: "${o.text.slice(0, 20)}…"`)
        why(id, o.why, say)
      }
      break
    }
    case 'truefalse':
      why(id, ex.why, say)
      break
    case 'order':
      if (ex.items.length < 3 || ex.items.length > 6) say(id, 'ordering needs 3–6 items')
      if (new Set(ex.items).size !== ex.items.length) say(id, 'duplicate items')
      why(id, ex.why, say)
      break
    case 'match': {
      if (ex.pairs.length < 3 || ex.pairs.length > 5) say(id, 'matching needs 3–5 pairs')
      const chips = matchChips(ex)
      if (new Set(chips).size !== chips.length) say(id, 'duplicate chips: a pair could not be told apart')
      if (new Set(ex.pairs.map((p) => p.left)).size !== ex.pairs.length) say(id, 'duplicate left items')
      for (const p of ex.pairs) why(id, p.why, say)
      break
    }
    case 'cloze': {
      const blanks = clozeBlanks(ex.text)
      if (!blanks.length) say(id, 'cloze has no {{blank}}')
      if (blanks.some((b) => !b.answers.every(Boolean))) say(id, 'empty answer in a blank')
      why(id, ex.why, say)
      break
    }
    case 'flashcards':
      if (ex.cards.length < 2) say(id, 'needs at least 2 cards')
      for (const c of ex.cards) {
        if (visibleLength(c.front) > LIMITS.card || visibleLength(c.back) > LIMITS.card) say(id, `card over ${LIMITS.card} characters`)
        if (visibleLength(c.back) < 2) say(id, 'card back is empty')
      }
      break
  }
}
