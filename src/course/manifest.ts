// A plain-data view of the course for QA: step order and the marked answers, with no React.
import { clozeBlanks, matchChips } from './grade'
import type { CourseDef, Exercise, LabAction } from './types'

export type ManifestExercise =
  | { type: 'single' | 'multi'; correct: number[]; count: number }
  | { type: 'truefalse'; answer: boolean }
  | { type: 'order'; count: number }
  | { type: 'match'; solution: number[]; chips: number; pairs: number }
  | { type: 'cloze'; answers: string[] }
  | { type: 'flashcards'; cards: number }

export interface ManifestStep {
  id: string
  kind: 'read' | 'practice' | 'lab'
  section: string
  concept?: string
  scored: boolean
  pretest?: boolean
  exercise?: ManifestExercise
  tasks?: string[]
  solve?: LabAction[]
  cites: string[]
  hasWorked?: boolean
}

function ex(e: Exercise): ManifestExercise {
  switch (e.type) {
    case 'single':
    case 'multi':
      return { type: e.type, correct: e.options.flatMap((o, i) => (o.correct ? [i] : [])), count: e.options.length }
    case 'truefalse':
      return { type: 'truefalse', answer: e.answer }
    case 'order':
      return { type: 'order', count: e.items.length }
    case 'match': {
      const chips = matchChips(e)
      return { type: 'match', solution: e.pairs.map((p) => chips.indexOf(p.right)), chips: chips.length, pairs: e.pairs.length }
    }
    case 'cloze':
      return { type: 'cloze', answers: clozeBlanks(e.text).map((b) => b.answers[0]) }
    case 'flashcards':
      return { type: 'flashcards', cards: e.cards.length }
  }
}

export function manifest(c: CourseDef) {
  return {
    id: c.id,
    title: c.title,
    sources: Object.keys(c.sources),
    concepts: Object.keys(c.concepts),
    steps: c.sections.flatMap((sec) =>
      sec.steps.map((s): ManifestStep => {
        const base = { id: s.id, kind: s.kind, section: sec.id, cites: s.cites }
        if (s.kind === 'read') return { ...base, scored: false }
        if (s.kind === 'lab') return { ...base, scored: false, concept: s.concept, tasks: s.tasks.map((t) => t.id), solve: s.solve }
        return { ...base, concept: s.concept, pretest: s.pretest, scored: !s.pretest && s.exercise.type !== 'flashcards', exercise: ex(s.exercise) }
      }),
    ),
  }
}
