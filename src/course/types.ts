// A lesson as data: AI or an author fills typed fields, the engine draws and grades them,
// and `validate` plus scripts/course-qa.mjs decide whether it ships.
//
// Rules the types cannot express are enforced by validate.ts; see LIMITS there.
// Why the rules exist: plans/research-course.md.
import type { EmojiStyle } from '../emoji'
import type { ReactElement } from 'react'
import type { IconStyle } from '../kit/Icon'
import type { ThemeName } from '../kit/theme'

export interface Source {
  /** Publisher or author, e.g. "AWS". */
  org: string
  /** Document title. */
  title: string
  url?: string
  /** When it was read, or how a figure was derived. */
  note?: string
}

export interface Concept {
  /** ≤ 12 CJK characters. Shown in the result table. */
  label: string
  /** The read step to send a learner back to. Must be a step id. */
  review: string
}

export interface Choice {
  /** ≤ 70 CJK characters. Inline `code` and **bold** allowed. */
  text: string
  correct?: boolean
  /** Required on every option, right or wrong: why this one is right or what mistake it represents. 10–110 CJK characters. */
  why: string
}

export interface Pair {
  left: string
  right: string
  /** Why these belong together. 10–90 CJK characters. */
  why: string
}

export type Exercise =
  /** Exactly one correct option, 3–5 in total. */
  | { type: 'single'; prompt: string; options: Choice[]; given?: Given[] }
  /** At least one correct and one wrong option, 3–6 in total. */
  | { type: 'multi'; prompt: string; options: Choice[]; given?: Given[] }
  /** `statement` is a claim the learner rates. */
  | { type: 'truefalse'; statement: string; answer: boolean; why: string }
  /** `items` in the correct order; the engine shuffles them. 3–6 items. */
  | { type: 'order'; prompt: string; items: string[]; ends?: [string, string]; why: string }
  /** 3–5 pairs. Tap a slot, tap a chip. `decoys` are extra wrong chips. */
  | { type: 'match'; prompt: string; pairs: Pair[]; decoys?: string[] }
  /** `text` holds blanks as {{答案|别名}}: anything between | is also accepted, ignoring case and outer spaces. */
  | { type: 'cloze'; prompt: string; text: string; why: string; mono?: boolean }
  /** Self-rated, so never scored. Anything marked "didn't recall" returns in the retry round. */
  | { type: 'flashcards'; prompt: string; cards: { front: string; back: string }[] }

/** A faded worked example: givens already answered for the learner, who makes the remaining decision. */
export interface Given {
  label: string
  value: string
}

export interface ReadStep {
  kind: 'read'
  id: string
  /** ≤ 26 CJK characters. */
  title: string
  /** One idea. Prefer short text and an explanatory figure. Photos and decor do not belong here. */
  blocks: ReactElement[]
  /** Keys into CourseDef.sources. Required unless `illustrative` says the step states no outside fact. */
  cites: string[]
  illustrative?: boolean
}

export interface PracticeStep {
  kind: 'practice'
  id: string
  concept: string
  exercise: Exercise
  cites: string[]
  /** Opening question: answered and explained, but not scored. */
  pretest?: boolean
}

export interface LabTask {
  id: string
  /** ≤ 44 CJK characters. */
  text: string
  /** Shown as soon as the task is done: what the learner just saw and why. 10–90 CJK characters. */
  why: string
}

export interface LabContext {
  done: ReadonlySet<string>
  complete: (taskId: string) => void
  /** The next unfinished task. */
  active?: LabTask
  /** Task checklist; the lab decides where it goes and may add a control to each row. */
  tasks: (action?: (t: LabTask) => ReactElement | null) => ReactElement
}

/** Scripted solution, so QA can play a lab with a mouse, a finger or a keyboard. */
export type LabAction = { click: string } | { fill: [selector: string, text: string] } | { expect: string }

export interface LabStep {
  kind: 'lab'
  id: string
  concept: string
  title: string
  lead: string
  /** Visible wherever the lab is shown, e.g. "模拟器：不连接任何真实服务". Mandatory for honesty. */
  simulation: string
  tasks: LabTask[]
  render: (ctx: LabContext) => ReactElement
  solve: LabAction[]
  cites: string[]
}

export type Step = ReadStep | PracticeStep | LabStep

export interface Section {
  id: string
  /** ≤ 16 CJK characters. */
  title: string
  steps: Step[]
}

export interface CourseDef {
  /** Storage key. Change it when a course changes enough that old progress is meaningless. */
  id: string
  title: string
  /** One sentence on the cover. ≤ 60 CJK characters. */
  lead: string
  lang?: 'zh' | 'en'
  theme?: ThemeName
  iconStyle?: IconStyle
  /** Emoji set for any emoji typed in the text: fluent (default), flat or noto. */
  emojiStyle?: EmojiStyle
  look?: 'editorial' | 'formal'
  /** Your honest estimate; the cover labels it as an estimate. */
  minutes: [number, number]
  /** "After this you can…" 3–5 items, each ≤ 40 CJK characters. */
  objectives: string[]
  /** Illustration on the cover. It must explain something: no atmosphere. */
  hero?: ReactElement
  concepts: Record<string, Concept>
  sources: Record<string, Source>
  sections: Section[]
  /** "Made with PCafe" on the cover and the results page. `false` hides it; needs PCafe Pro (LICENSE, Exhibit B). */
  attribution?: boolean
}

/** A learner's answer, in the authored order so it survives shuffling and reloads. */
export type Response =
  | { type: 'single'; option: number }
  | { type: 'multi'; options: number[] }
  | { type: 'truefalse'; value: boolean }
  | { type: 'order'; order: number[] }
  /** chip index for each pair; -1 when empty. Chips: pairs[i].right, then decoys. */
  | { type: 'match'; chips: number[] }
  | { type: 'cloze'; blanks: string[] }
