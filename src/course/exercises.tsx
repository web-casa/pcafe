// The exercises. Every interaction is a real input or button, so the mouse, touch and keyboard
// paths are the same code. Nothing here drags (WCAG 2.5.7). After checking, right and wrong always
// carry an icon and a text label, never colour alone (WCAG 1.4.1).
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Icon } from '../kit/Icon'
import { Rich } from './blocks'
import { clozeBlanks, grade, matchChips, parseCloze, shuffled, shuffledOrder } from './grade'
import { useUi } from './i18n'
import type { Exercise, Response } from './types'
import type { Attempt } from './store'

type Ex<T extends Exercise['type']> = Extract<Exercise, { type: T }>

export interface ExerciseProps<T extends Exercise['type']> {
  ex: Ex<T>
  /** Changes between rounds, so a retry cannot be solved from position memory. */
  seed: string
  draft: Response | null
  setDraft: (r: Response) => void
  /** Set once answered: the exercise locks and explains itself. */
  attempt?: Attempt
}

/** The starting draft. Ordering starts shuffled and is never already correct. */
export function initialDraft(ex: Exercise, seed: string): Response | null {
  switch (ex.type) {
    case 'order':
      return { type: 'order', order: shuffledOrder(ex.items.length, seed) }
    case 'match':
      return { type: 'match', chips: ex.pairs.map(() => -1) }
    case 'cloze':
      return { type: 'cloze', blanks: clozeBlanks(ex.text).map(() => '') }
    default:
      return null
  }
}

/** Why the answer cannot be checked yet, or null when it can. */
export function incomplete(ex: Exercise, draft: Response | null, ui: ReturnType<typeof useUi>): string | null {
  switch (ex.type) {
    case 'single':
    case 'truefalse':
      return draft ? null : ui.pickOne
    case 'multi':
      return draft?.type === 'multi' && draft.options.length ? null : ui.pickSome
    case 'cloze': {
      const left = draft?.type === 'cloze' ? draft.blanks.filter((b) => !b.trim()).length : 1
      return left ? ui.fillAll(left) : null
    }
    case 'match': {
      const left = draft?.type === 'match' ? draft.chips.filter((c) => c < 0).length : 1
      return left ? ui.fillPairs(left) : null
    }
    default:
      return null
  }
}

const Chevron = ({ up }: { up?: boolean }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d={up ? 'M5 15l7-7 7 7' : 'M5 9l7 7 7-7'} />
  </svg>
)

const mark = (ok: boolean) => <Icon name={ok ? 'check' : 'close'} size={18} variant="linear" />

/* ---------- single and multiple choice ---------- */

export function ChoiceExercise({ ex, seed, draft, setDraft, attempt }: ExerciseProps<'single' | 'multi'>) {
  const ui = useUi()
  const multi = ex.type === 'multi'
  const order = useMemo(() => shuffled(ex.options.map((_, i) => i), seed), [ex.options, seed])
  const response = attempt?.response ?? draft
  const picked = useMemo(() => {
    if (response?.type === 'single') return new Set([response.option])
    if (response?.type === 'multi') return new Set(response.options)
    return new Set<number>()
  }, [response])
  const toggle = (i: number) => {
    if (attempt) return
    if (!multi) return setDraft({ type: 'single', option: i })
    const next = new Set(picked)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setDraft({ type: 'multi', options: [...next].sort((a, b) => a - b) })
  }
  return (
    <fieldset className="c-ex c-choices" data-ex={ex.type} disabled={!!attempt}>
      <legend className="c-prompt">
        <Rich text={ex.prompt} />
        {multi && <span className="c-hint-inline">{ui.multiHint}</span>}
      </legend>
      {ex.given && <Givens given={ex.given} />}
      <div className="c-choices__list">
        {order.map((i, pos) => {
          const o = ex.options[i]
          const chosen = picked.has(i)
          const state = attempt ? (o.correct ? 'right' : chosen ? 'wrong' : 'idle') : chosen ? 'chosen' : 'idle'
          const label = attempt ? (o.correct ? (chosen ? `${ui.yourPick} · ${ui.rightAnswer}` : multi ? `${ui.missed} · ${ui.rightAnswer}` : ui.rightAnswer) : chosen ? ui.yourPick : null) : null
          return (
            <label key={i} className="c-choice" data-opt={i} data-state={state} data-correct={attempt ? String(!!o.correct) : undefined}>
              <input type={multi ? 'checkbox' : 'radio'} name={`choice-${seed}`} checked={chosen} onChange={() => toggle(i)} />
              <span className="c-choice__key" aria-hidden="true">
                {attempt && (o.correct || chosen) ? mark(!!o.correct) : ui.optionLetter(pos)}
              </span>
              <span className="c-choice__body">
                <span className="c-choice__text">
                  <Rich text={o.text} />
                </span>
                {label && <span className="c-choice__label">{label}</span>}
                {attempt && (
                  <span className="c-choice__why" data-why>
                    <Rich text={o.why} />
                  </span>
                )}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function Givens({ given }: { given: { label: string; value: string }[] }) {
  return (
    <dl className="c-given">
      {given.map((g) => (
        <div key={g.label}>
          <dt>{g.label}</dt>
          <dd>
            <Rich text={g.value} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

/* ---------- true or false ---------- */

export function TrueFalseExercise({ ex, seed, draft, setDraft, attempt }: ExerciseProps<'truefalse'>) {
  const ui = useUi()
  const response = attempt?.response ?? draft
  const value = response?.type === 'truefalse' ? response.value : null
  const options: { v: boolean; label: string; icon: 'check' | 'close' }[] = [
    { v: true, label: ui.yes, icon: 'check' },
    { v: false, label: ui.no, icon: 'close' },
  ]
  return (
    <fieldset className="c-ex c-tf" data-ex="truefalse" disabled={!!attempt}>
      <legend className="c-sr">{ui.statementLabel}</legend>
      <blockquote className="c-claim">
        <Rich text={ex.statement} />
      </blockquote>
      <div className="c-tf__row">
        {options.map((o) => {
          const chosen = value === o.v
          const state = attempt ? (o.v === ex.answer ? 'right' : chosen ? 'wrong' : 'idle') : chosen ? 'chosen' : 'idle'
          return (
            <label key={String(o.v)} className="c-tile" data-opt={String(o.v)} data-state={state} data-correct={attempt ? String(o.v === ex.answer) : undefined}>
              <input type="radio" name={`tf-${seed}`} checked={chosen} onChange={() => !attempt && setDraft({ type: 'truefalse', value: o.v })} />
              <Icon name={o.icon} size={26} variant="linear" />
              <b>{o.label}</b>
              {attempt && (o.v === ex.answer || chosen) && <span className="c-choice__label">{o.v === ex.answer ? (chosen ? `${ui.yourPick} · ${ui.rightAnswer}` : ui.rightAnswer) : ui.yourPick}</span>}
            </label>
          )
        })}
      </div>
      {attempt && (
        <p className="c-why" data-why>
          <Rich text={ex.why} />
        </p>
      )}
    </fieldset>
  )
}

/* ---------- ordering: up and down buttons, the same for mouse, finger and keyboard ---------- */

export function OrderExercise({ ex, draft, setDraft, attempt }: ExerciseProps<'order'>) {
  const ui = useUi()
  const response = attempt?.response ?? draft
  const order = response?.type === 'order' ? response.order : ex.items.map((_, i) => i)
  const [said, setSaid] = useState('')
  // Reordering moves DOM nodes, which drops keyboard focus: put it back on the same control.
  const list = useRef<HTMLOListElement>(null)
  const pending = useRef<{ item: number; dir: 'up' | 'down' } | null>(null)
  useLayoutEffect(() => {
    const p = pending.current
    if (!p) return
    pending.current = null
    list.current?.querySelector<HTMLElement>(`[data-item="${p.item}"] [data-${p.dir}]`)?.focus()
  }, [order])
  const move = (pos: number, by: number) => {
    const to = pos + by
    if (attempt || to < 0 || to >= order.length) return
    const next = [...order]
    ;[next[pos], next[to]] = [next[to], next[pos]]
    pending.current = { item: order[pos], dir: by < 0 ? 'up' : 'down' }
    setDraft({ type: 'order', order: next })
    setSaid(ui.movedTo(ex.items[order[pos]], to + 1))
  }
  return (
    <div className="c-ex c-order" data-ex="order" role="group" aria-labelledby="c-order-prompt">
      <p className="c-prompt" id="c-order-prompt">
        <Rich text={ex.prompt} />
      </p>
      {!attempt && <p className="c-hint">{ui.orderHint}</p>}
      {ex.ends && <p className="c-order__end">{ex.ends[0]}</p>}
      <ol className="c-order__list" ref={list}>
        {order.map((item, pos) => {
          const ok = item === pos
          return (
            <li key={item} data-item={item} data-state={attempt ? (ok ? 'right' : 'wrong') : 'idle'}>
              <span className="c-order__pos" aria-hidden="true">
                {attempt ? mark(ok) : pos + 1}
              </span>
              <span className="c-order__text">
                <Rich text={ex.items[item]} />
                {attempt && !ok && <span className="c-choice__label">{ui.shouldBe(`#${item + 1}`)}</span>}
              </span>
              {!attempt && (
                <span className="c-order__btns">
                  <button type="button" data-up aria-label={ui.moveUp(ex.items[item])} aria-disabled={pos === 0} onClick={() => move(pos, -1)}>
                    <Chevron up />
                  </button>
                  <button type="button" data-down aria-label={ui.moveDown(ex.items[item])} aria-disabled={pos === order.length - 1} onClick={() => move(pos, 1)}>
                    <Chevron />
                  </button>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {ex.ends && <p className="c-order__end">{ex.ends[1]}</p>}
      <span className="c-sr" role="status">
        {said}
      </span>
      {attempt && (
        <div className="c-why" data-why>
          {!attempt.ok && (
            <p className="c-why__answer">
              <b>{ui.answerPrefix}</b>
              {ex.items.join(' → ')}
            </p>
          )}
          <p>
            <Rich text={ex.why} />
          </p>
        </div>
      )}
    </div>
  )
}

/* ---------- matching: tap a slot, tap a chip ---------- */

export function MatchExercise({ ex, seed, draft, setDraft, attempt }: ExerciseProps<'match'>) {
  const ui = useUi()
  const chips = useMemo(() => matchChips(ex), [ex])
  const chipOrder = useMemo(() => shuffled(chips.map((_, i) => i), `${seed}:chips`), [chips, seed])
  const leftOrder = useMemo(() => shuffled(ex.pairs.map((_, i) => i), `${seed}:left`), [ex.pairs, seed])
  const response = attempt?.response ?? draft
  const filled = response?.type === 'match' ? response.chips : ex.pairs.map(() => -1)
  const [active, setActive] = useState(leftOrder[0] ?? 0)

  const pick = (chip: number) => {
    if (attempt) return
    // A chip already used elsewhere moves here, so no button ever disappears under keyboard focus.
    const next = filled.map((c) => (c === chip ? -1 : c))
    next[active] = chip
    setDraft({ type: 'match', chips: next })
    const after = [...leftOrder.slice(leftOrder.indexOf(active) + 1), ...leftOrder.slice(0, leftOrder.indexOf(active))].find((i) => next[i] < 0)
    if (after !== undefined) setActive(after)
  }
  const pressSlot = (i: number) => {
    if (attempt) return
    if (filled[i] >= 0) {
      const next = [...filled]
      next[i] = -1
      setDraft({ type: 'match', chips: next })
    }
    setActive(i)
  }
  return (
    <div className="c-ex c-match" data-ex="match" role="group" aria-labelledby="c-match-prompt">
      <p className="c-prompt" id="c-match-prompt">
        <Rich text={ex.prompt} />
      </p>
      {!attempt && <p className="c-hint">{ui.matchHint}</p>}
      <ul className="c-match__rows">
        {leftOrder.map((i) => {
          const p = ex.pairs[i]
          const value = filled[i] >= 0 ? chips[filled[i]] : null
          const ok = value === p.right
          return (
            <li key={i} data-pair={i} data-state={attempt ? (ok ? 'right' : 'wrong') : i === active ? 'active' : 'idle'}>
              <span className="c-match__left">
                <Rich text={p.left} />
              </span>
              {attempt ? (
                <span className="c-match__result">
                  <span className="c-match__value">
                    {mark(ok)}
                    {value ? <Rich text={value} /> : ui.notChosen}
                  </span>
                  {!ok && (
                    <span className="c-choice__label">
                      {ui.answerPrefix}
                      <Rich text={p.right} />
                    </span>
                  )}
                  <span className="c-choice__why" data-why>
                    <Rich text={p.why} />
                  </span>
                </span>
              ) : (
                <button type="button" className="c-slot" data-slot={i} aria-label={ui.slotLabel(p.left, value ?? ui.notChosen)} aria-pressed={i === active} onClick={() => pressSlot(i)}>
                  {value ? <Rich text={value} /> : <em>{ui.slotEmpty}</em>}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {!attempt && (
        <div className="c-chips" role="group" aria-label={ui.chipsLabel}>
          {chipOrder.map((c) => (
            <button type="button" key={c} className="c-chip" data-chip={c} aria-pressed={filled.includes(c)} onClick={() => pick(c)}>
              <Rich text={chips[c]} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- cloze: typed recall ---------- */

export function ClozeExercise({ ex, draft, setDraft, attempt, onEnter }: ExerciseProps<'cloze'> & { onEnter: () => void }) {
  const ui = useUi()
  const parts = useMemo(() => parseCloze(ex.text), [ex.text])
  const response = attempt?.response ?? draft
  const blanks = response?.type === 'cloze' ? response.blanks : []
  const result = attempt ? grade(ex, attempt.response) : null
  const set = (i: number, v: string) => {
    const next = [...blanks]
    next[i] = v
    setDraft({ type: 'cloze', blanks: next })
  }
  return (
    <div className="c-ex c-cloze" data-ex="cloze" role="group" aria-labelledby="c-cloze-prompt">
      <p className="c-prompt" id="c-cloze-prompt">
        <Rich text={ex.prompt} />
      </p>
      <p className={`c-cloze__text${ex.mono ? ' is-mono' : ''}`}>
        {parts.map((p, k) =>
          'text' in p ? (
            <span key={k}>{p.text}</span>
          ) : (
            <span key={k} className="c-blank" data-state={result ? (result.parts[p.blank] ? 'right' : 'wrong') : 'idle'}>
              {result && mark(result.parts[p.blank])}
              <input
                data-blank={p.blank}
                aria-label={ui.blankLabel(p.blank + 1)}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="done"
                readOnly={!!attempt}
                value={blanks[p.blank] ?? ''}
                style={{ width: `${Math.min(14, Math.max(4, p.answers[0].length * (/[^\x00-\x7f]/.test(p.answers[0]) ? 1.5 : 0.8) + 2))}em` }}
                onChange={(e) => set(p.blank, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !attempt) {
                    e.preventDefault()
                    onEnter()
                  }
                }}
              />
              {result && !result.parts[p.blank] && <span className="c-blank__answer">{p.answers[0]}</span>}
            </span>
          ),
        )}
      </p>
      {attempt && (
        <p className="c-why" data-why>
          <Rich text={ex.why} />
        </p>
      )}
    </div>
  )
}

/** Picks the right component for an exercise. Flashcards run themselves: see Cards in Course.tsx. */
export function ExerciseBody(props: ExerciseProps<Exercise['type']> & { onEnter: () => void }): ReactNode {
  const { ex, onEnter, ...rest } = props
  switch (ex.type) {
    case 'single':
    case 'multi':
      return <ChoiceExercise ex={ex} {...rest} />
    case 'truefalse':
      return <TrueFalseExercise ex={ex} {...rest} />
    case 'order':
      return <OrderExercise ex={ex} {...rest} />
    case 'match':
      return <MatchExercise ex={ex} {...rest} />
    case 'cloze':
      return <ClozeExercise ex={ex} {...rest} onEnter={onEnter} />
    case 'flashcards':
      return null
  }
}

/** The answer in words: for the live region and the printed result. */
export function answerText(ex: Exercise, yes: string, no: string): string {
  switch (ex.type) {
    case 'single':
    case 'multi':
      return ex.options
        .filter((o) => o.correct)
        .map((o) => o.text)
        .join(' / ')
    case 'truefalse':
      return ex.answer ? yes : no
    case 'order':
      return ex.items.join(' → ')
    case 'match':
      return ex.pairs.map((p) => `${p.left} = ${p.right}`).join('；')
    case 'cloze':
      return clozeBlanks(ex.text)
        .map((b) => b.answers[0])
        .join('；')
    case 'flashcards':
      return ''
  }
}

export const promptOf = (ex: Exercise) => (ex.type === 'truefalse' ? ex.statement : ex.prompt)
