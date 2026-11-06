// The lesson shell: routes in the URL hash, a contents rail or drawer, the step views, the
// results page. Steps are cut at concept boundaries and nothing ever advances by itself.
import { Credit, creditOn } from '../engine/attribution'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { Icon } from '../kit/Icon'
import { Rich } from './blocks'
import { Cards, startRun } from './cards'
import { answerText, ExerciseBody, incomplete, initialDraft, promptOf } from './exercises'
import { grade, shuffled } from './grade'
import { useUi, type Ui } from './i18n'
import { useProgress, type Attempt, type Progress, type StorageState } from './store'
import { allSteps } from './validate'
import type { CourseDef, LabStep, LabTask, PracticeStep, ReadStep, Response, Source, Step } from './types'

type Route = { name: 'start' } | { name: 'step'; id: string } | { name: 'finish' } | { name: 'sources' } | { name: 'drill'; n: number }

function parseRoute(hash: string, steps: Step[]): Route | null {
  const h = hash.replace(/^#\/?/, '')
  if (!h) return null
  if (h === 'start') return { name: 'start' }
  if (h === 'finish') return { name: 'finish' }
  if (h === 'sources') return { name: 'sources' }
  const drill = h.match(/^drill\/(\d+)$/)
  if (drill) return { name: 'drill', n: Number(drill[1]) }
  const step = h.match(/^s\/(.+)$/)
  if (step && steps.some((s) => s.id === decodeURIComponent(step[1]))) return { name: 'step', id: decodeURIComponent(step[1]) }
  return { name: 'start' }
}

const hrefOf = (id: string) => `#/s/${encodeURIComponent(id)}`
const go = (href: string) => {
  location.hash = href
}

/** Exercises that count toward the score. */
export const isScored = (s: Step): s is PracticeStep => s.kind === 'practice' && !s.pretest && s.exercise.type !== 'flashcards'

/** Filled by Course so other views can read what the sources are numbered as. */
function sourceNumbers(course: CourseDef) {
  const used: string[] = []
  for (const s of allSteps(course)) for (const k of s.cites) if (!used.includes(k)) used.push(k)
  for (const k of Object.keys(course.sources)) if (!used.includes(k)) used.push(k)
  return new Map(used.map((k, i) => [k, i + 1]))
}

export function Course({ course }: { course: CourseDef }) {
  const ui = useUi()
  const steps = useMemo(() => allSteps(course), [course])
  const { progress, setProgress, storage, reset } = useProgress(course)
  const numbers = useMemo(() => sourceNumbers(course), [course])
  const [route, setRoute] = useState<Route>(() => {
    const r = parseRoute(location.hash, steps)
    if (r) return r
    return parseRoute(progress.at, steps) ?? { name: 'start' }
  })
  const [resumed, setResumed] = useState(() => !parseRoute(location.hash, steps) && !!parseRoute(progress.at, steps) && parseRoute(progress.at, steps)?.name === 'step')
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    const on = () => {
      const r = parseRoute(location.hash, steps) ?? { name: 'start' as const }
      setRoute(r)
      setResumed(false)
      setDrawer(false)
    }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [steps])

  // Keep the URL and the stored position in step.
  useEffect(() => {
    if (route.name === 'step') {
      const h = hrefOf(route.id)
      if (location.hash !== h) history.replaceState(null, '', h)
      setProgress((p) => ({ ...p, at: h, seen: p.seen.includes(route.id) ? p.seen : [...p.seen, route.id] }))
    } else if (route.name === 'finish' || route.name === 'sources' || route.name === 'drill') {
      if (route.name !== 'sources') setProgress((p) => ({ ...p, at: `#/${route.name === 'drill' ? `drill/${route.n}` : 'finish'}` }))
    }
  }, [route, setProgress])

  // Each new screen: top of the page, and focus on its heading, so keyboard and screen reader users land in the right place.
  const routeKey = JSON.stringify(route)
  const firstRender = useRef(true)
  useLayoutEffect(() => {
    scrollTo(0, 0)
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
  }, [routeKey])

  const index = route.name === 'step' ? steps.findIndex((s) => s.id === route.id) : -1
  const openContents = useCallback(() => setDrawer(true), [])

  if (route.name === 'start') {
    return <Start course={course} steps={steps} progress={progress} storage={storage} onReset={reset} />
  }

  const body = (() => {
    if (route.name === 'step') {
      const step = steps[index]
      return (
        <StepView
          key={step.id}
          course={course}
          step={step}
          index={index}
          steps={steps}
          progress={progress}
          setProgress={setProgress}
          numbers={numbers}
          resumed={resumed}
          onReset={() => {
            reset()
            go('#/start')
          }}
        />
      )
    }
    if (route.name === 'drill') return <DrillView course={course} n={route.n} steps={steps} progress={progress} setProgress={setProgress} numbers={numbers} />
    if (route.name === 'finish') return <Finish course={course} steps={steps} progress={progress} setProgress={setProgress} storage={storage} onReset={reset} />
    return <Sources course={course} numbers={numbers} />
  })()

  return (
    <div className="c-app">
      <TopBar course={course} steps={steps} index={index} progress={progress} storage={storage} onContents={openContents} />
      {storage === 'memory' && (
        <p className="c-banner" data-storage-banner>
          <Icon name="shield-warning" size={18} />
          {ui.memoryNote}
        </p>
      )}
      <div className="c-layout">
        <aside className="c-rail">
          <Contents course={course} current={route.name === 'step' ? route.id : null} route={route} progress={progress} />
        </aside>
        <main className="c-main" data-route={route.name}>
          {body}
        </main>
      </div>
      {drawer && (
        <Drawer onClose={() => setDrawer(false)}>
          <Contents course={course} current={route.name === 'step' ? route.id : null} route={route} progress={progress} />
        </Drawer>
      )}
    </div>
  )
}

/* ---------- chrome ---------- */

function stepState(s: Step, p: Progress): 'right' | 'wrong' | 'done' | 'seen' | 'todo' {
  if (s.kind === 'practice') {
    if (s.exercise.type === 'flashcards') return p.cards[s.id] && !p.cards[s.id].queue.length ? 'done' : p.seen.includes(s.id) ? 'seen' : 'todo'
    const a = p.first[s.id]
    if (!a) return p.seen.includes(s.id) ? 'seen' : 'todo'
    if (s.pretest) return 'done'
    return (p.latest[s.id] ?? a.ok) ? 'right' : 'wrong'
  }
  if (s.kind === 'lab') return (p.labs[s.id]?.length ?? 0) >= s.tasks.length ? 'done' : p.seen.includes(s.id) ? 'seen' : 'todo'
  return p.seen.includes(s.id) ? 'done' : 'todo'
}

function TopBar({ course, steps, index, progress, storage, onContents }: { course: CourseDef; steps: Step[]; index: number; progress: Progress; storage: StorageState; onContents: () => void }) {
  const ui = useUi()
  return (
    <header className="c-top">
      <button type="button" className="c-iconbtn c-top__menu" data-contents aria-label={ui.contents} onClick={onContents}>
        <Icon name="list" size={22} />
      </button>
      <a className="c-top__title" href="#/start">
        {course.title}
      </a>
      <div className="c-top__progress" aria-hidden="true">
        {steps.map((s) => (
          <i key={s.id} data-state={stepState(s, progress)} data-current={steps[index]?.id === s.id || undefined} />
        ))}
      </div>
      <span className="c-top__count">{index >= 0 ? ui.stepOf(index + 1, steps.length) : ''}</span>
      <span className="c-top__save" data-storage={storage} title={storage === 'saved' ? ui.savedNote : ui.memoryNote}>
        {storage === 'saved' ? ui.saved : ui.memory}
      </span>
      <a className="c-top__link" href="#/finish" data-nav-finish>
        {ui.results}
      </a>
      <a className="c-top__link" href="#/sources" data-nav-sources>
        {ui.sources}
      </a>
    </header>
  )
}

const GLYPH: Record<ReturnType<typeof stepState>, ReactNode> = {
  right: <Icon name="check" size={15} variant="linear" />,
  wrong: <Icon name="close" size={15} variant="linear" />,
  done: <i className="c-dot is-done" />,
  seen: <i className="c-dot is-seen" />,
  todo: <i className="c-dot" />,
}

function stepLabel(s: Step, ui: Ui, course: CourseDef) {
  if (s.kind === 'practice') return s.pretest ? ui.pretest : `${ui.practice} · ${course.concepts[s.concept]?.label ?? ''}`
  return s.title
}

function Contents({ course, current, route, progress }: { course: CourseDef; current: string | null; route: Route; progress: Progress }) {
  const ui = useUi()
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    ref.current?.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest' })
  }, [current])
  let n = 0
  return (
    <nav aria-label={ui.contents} className="c-contents" ref={ref}>
      {course.sections.map((sec) => (
        <section key={sec.id}>
          <h2>{sec.title}</h2>
          <ol>
            {sec.steps.map((s) => {
              n++
              const state = stepState(s, progress)
              return (
                <li key={s.id}>
                  <a href={hrefOf(s.id)} data-nav-step={s.id} data-kind={s.kind} data-state={state} aria-current={current === s.id ? 'step' : undefined} aria-label={`${n}. ${stepLabel(s, ui, course)}${state === 'right' ? ` (${ui.markRight})` : state === 'wrong' ? ` (${ui.markWrong})` : ''}`}>
                    <span className="c-contents__glyph" aria-hidden="true">
                      {GLYPH[state]}
                    </span>
                    <span>{stepLabel(s, ui, course)}</span>
                  </a>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
      <ul className="c-contents__end">
        <li>
          <a href="#/finish" aria-current={route.name === 'finish' ? 'page' : undefined}>
            {ui.results}
          </a>
        </li>
        <li>
          <a href="#/sources" aria-current={route.name === 'sources' ? 'page' : undefined}>
            {ui.sources}
          </a>
        </li>
      </ul>
    </nav>
  )
}

function Drawer({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const ui = useUi()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    ref.current?.showModal()
  }, [])
  return (
    <dialog ref={ref} className="c-drawer" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      <div className="c-drawer__head">
        <b>{ui.contents}</b>
        <button type="button" className="c-iconbtn" aria-label={ui.close} onClick={onClose}>
          <Icon name="close" size={22} variant="linear" />
        </button>
      </div>
      {children}
    </dialog>
  )
}

/** Back and forward. Sticky at the foot of the screen, so the next action is always under the thumb. */
function ActionBar({ prev, children }: { prev?: string; children: ReactNode }) {
  const ui = useUi()
  return (
    <div className="c-actions">
      {prev ? (
        <a className="c-btn c-btn--quiet" href={prev} data-action="prev">
          <Arrow back />
          <span>{ui.prev}</span>
        </a>
      ) : (
        <span />
      )}
      <div className="c-actions__main">{children}</div>
    </div>
  )
}

const Arrow = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={back ? 'M19 12H5m6-6l-6 6 6 6' : 'M5 12h14m-6-6l6 6-6 6'} />
  </svg>
)

function Cites({ course, cites, numbers, illustrative }: { course: CourseDef; cites: string[]; numbers: Map<string, number>; illustrative?: boolean }) {
  const ui = useUi()
  if (!cites.length) return illustrative ? <p className="c-cites">{ui.illustrative}</p> : null
  return (
    <p className="c-cites" data-cites={cites.length}>
      <span>{ui.cite}</span>
      {cites.map((k) => (
        <a key={k} href="#/sources" data-cite={k} title={`${course.sources[k]?.org} · ${course.sources[k]?.title}`}>
          [{numbers.get(k)}] {course.sources[k]?.org}
        </a>
      ))}
    </p>
  )
}

/* ---------- start ---------- */

function Start({ course, steps, progress, storage, onReset }: { course: CourseDef; steps: Step[]; progress: Progress; storage: StorageState; onReset: () => void }) {
  const ui = useUi()
  const labs = steps.filter((s) => s.kind === 'lab').length
  const scored = steps.filter(isScored).length
  const atRoute = parseRoute(progress.at, steps)
  const firstStep = hrefOf(steps[0].id)
  const started = progress.seen.length > 0
  const [confirm, setConfirm] = useState(false)
  return (
    <main className="c-start" data-route="start">
      <div className="c-start__intro">
        <p className="c-eyebrow">{ui.estimate(course.minutes[0], course.minutes[1])}</p>
        <h1 tabIndex={-1}>{course.title}</h1>
        <p className="c-start__lead">{course.lead}</p>
        <div className="c-start__cta">
          <a className="c-btn c-btn--primary c-btn--big" href={atRoute && started ? progress.at : firstStep} data-action="start">
            <span>{started ? ui.resume : ui.start}</span>
            <Arrow />
          </a>
          {started && (
            <button
              type="button"
              className="c-btn c-btn--quiet"
              data-action="reset"
              onClick={() => {
                if (!confirm) return setConfirm(true)
                setConfirm(false)
                onReset()
              }}
            >
              {confirm ? ui.restartConfirm : ui.restart}
            </button>
          )}
        </div>
        <ul className="c-start__meta">
          <li>{ui.exerciseCount(scored)}</li>
          {labs > 0 && <li>{ui.labCount(labs)}</li>}
          <li>{ui.offline}</li>
        </ul>
      </div>
      {course.hero && <div className="c-start__hero">{course.hero}</div>}
      <section className="c-start__goals">
        <h2>{ui.youWill}</h2>
        <ol>
          {course.objectives.map((o) => (
            <li key={o}>
              <Rich text={o} />
            </li>
          ))}
        </ol>
      </section>
      <footer className="c-start__foot">
        <p>{ui.privacy}</p>
        <p data-storage-note={storage}>{storage === 'saved' ? ui.savedNote : ui.memoryNote}</p>
        <p>
          <a href="#/sources" data-nav-sources>
            {ui.sources}
          </a>
        </p>
        {creditOn(course.attribution) && (
          <p className="c-credit">
            <Credit lang={course.lang ?? 'zh'} />
          </p>
        )}
      </footer>
    </main>
  )
}

/* ---------- steps ---------- */

interface StepViewProps {
  course: CourseDef
  step: Step
  index: number
  steps: Step[]
  progress: Progress
  setProgress: (fn: (p: Progress) => Progress) => void
  numbers: Map<string, number>
  resumed: boolean
  onReset: () => void
}

function StepView({ course, step, index, steps, progress, setProgress, numbers, resumed, onReset }: StepViewProps) {
  const ui = useUi()
  const section = course.sections.find((s) => s.steps.some((x) => x.id === step.id))!
  const prev = index > 0 ? hrefOf(steps[index - 1].id) : '#/start'
  const next = index < steps.length - 1 ? hrefOf(steps[index + 1].id) : '#/finish'
  const nextLabel = index < steps.length - 1 ? ui.next : ui.toResults
  const drillRoute = progress.drill ? `#/${`drill/${Math.max(0, progress.drill.ids.findIndex((id) => !(id in progress.drill!.answers) && !isCardsDone(progress, id)))}`}` : null
  return (
    <article className="c-step" data-step={step.id} data-kind={step.kind}>
      {resumed && (
        <p className="c-resumed" role="status" data-resumed>
          {ui.resumed(index + 1)}
          <button type="button" className="c-link" onClick={onReset}>
            {ui.restart}
          </button>
        </p>
      )}
      {drillRoute && (
        <p className="c-resumed">
          <a href={drillRoute} data-action="back-to-drill">
            {ui.backToDrill}
          </a>
        </p>
      )}
      <p className="c-eyebrow">{section.title}</p>
      {step.kind === 'read' && <ReadBody step={step} />}
      {step.kind === 'lab' && <LabBody step={step} progress={progress} setProgress={setProgress} />}
      {step.kind === 'read' || step.kind === 'lab' ? (
        <>
          <Cites course={course} cites={step.cites} numbers={numbers} illustrative={step.kind === 'read' && step.illustrative} />
          <ActionBar prev={prev}>
            <a className="c-btn c-btn--primary" href={next} data-action="next">
              <span>{nextLabel}</span>
              <Arrow />
            </a>
          </ActionBar>
        </>
      ) : step.exercise.type === 'flashcards' ? (
        <>
          <h1 tabIndex={-1} className="c-kicker">
            {ui.practice}
          </h1>
          <Cards
            step={step}
            run={progress.cards[step.id]}
            onRun={(run) => setProgress((p) => ({ ...p, cards: { ...p.cards, [step.id]: run } }))}
            cards={step.exercise.cards.map((_, i) => i)}
          />
          <Cites course={course} cites={step.cites} numbers={numbers} />
          <ActionBar prev={prev}>
            <a className="c-btn c-btn--primary" href={next} data-action="next">
              <span>{nextLabel}</span>
              <Arrow />
            </a>
          </ActionBar>
        </>
      ) : (
        <Practice
          key={step.id}
          course={course}
          step={step}
          seed={step.id}
          attempt={progress.first[step.id]}
          prev={prev}
          next={next}
          nextLabel={nextLabel}
          numbers={numbers}
          onAnswer={(a) =>
            setProgress((p) => ({
              ...p,
              first: { ...p.first, [step.id]: a },
              latest: { ...p.latest, [step.id]: a.ok },
            }))
          }
        />
      )}
    </article>
  )
}

function ReadBody({ step }: { step: ReadStep }) {
  return (
    <>
      <h1 tabIndex={-1}>{step.title}</h1>
      <div className="c-blocks">{step.blocks.map((b, i) => <div key={i} className="c-block">{b}</div>)}</div>
    </>
  )
}

/* ---------- practice: draft, check, explain ---------- */

function Practice({ course, step, seed, attempt, prev, next, nextLabel, numbers, onAnswer, kicker }: { course: CourseDef; step: PracticeStep; seed: string; attempt?: Attempt; prev: string; next: string; nextLabel: string; numbers: Map<string, number>; onAnswer: (a: Attempt) => void; kicker?: string }) {
  const ui = useUi()
  const [draft, setDraft] = useState<Response | null>(() => initialDraft(step.exercise, seed))
  const [problem, setProblem] = useState<string | null>(null)
  const verdictRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLAnchorElement>(null)
  const answeredHere = useRef(false)
  const check = () => {
    const missing = incomplete(step.exercise, draft, ui)
    if (missing || !draft) return setProblem(missing)
    setProblem(null)
    answeredHere.current = true
    onAnswer({ response: draft, ok: grade(step.exercise, draft).ok, at: Date.now() })
  }
  useEffect(() => {
    if (!attempt || !answeredHere.current) return
    // The check button just became the next link: keep the keyboard on it. The status region does the announcing.
    nextRef.current?.focus({ preventScroll: true })
    verdictRef.current?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    // Only when an answer arrives, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!attempt])
  const verdict = attempt ? (step.pretest ? (attempt.ok ? ui.guessRight : ui.guessWrong) : attempt.ok ? ui.right : ui.wrong) : ''
  return (
    <>
      <h1 tabIndex={-1} className="c-kicker">
        {kicker ?? (step.pretest ? ui.pretest : ui.practice)}
        <span>{course.concepts[step.concept]?.label}</span>
      </h1>
      {/* The live region is always in the page; its text changes on checking (WCAG 4.1.3). */}
      <div ref={verdictRef} className="c-verdict" role="status" data-feedback data-verdict={attempt ? (attempt.ok ? 'right' : 'wrong') : undefined} data-tone={step.pretest && attempt ? 'guess' : undefined} hidden={!attempt && !problem}>
        {attempt ? (
          <>
            <Icon name={attempt.ok ? 'check' : step.pretest ? 'lightbulb' : 'close'} size={22} variant="linear" />
            <b>{verdict}</b>
            {step.pretest && <span>{ui.guessNote}</span>}
            <span className="c-sr">{feedbackText(step, attempt)}</span>
          </>
        ) : (
          problem && <span data-problem>{problem}</span>
        )}
      </div>
      <ExerciseBody ex={step.exercise} seed={seed} draft={draft} setDraft={(r) => { setDraft(r); setProblem(null) }} attempt={attempt} onEnter={check} />
      {attempt && <Cites course={course} cites={step.cites} numbers={numbers} />}
      <ActionBar prev={prev}>
        {attempt ? (
          <a className="c-btn c-btn--primary" href={next} data-action="next" ref={nextRef}>
            <span>{nextLabel}</span>
            <Arrow />
          </a>
        ) : (
          <>
            <a className="c-btn c-btn--quiet" href={next} data-action="skip">
              {ui.skip}
            </a>
            <button type="button" className="c-btn c-btn--primary" data-action="check" onClick={check}>
              {ui.check}
            </button>
          </>
        )}
      </ActionBar>
    </>
  )
}

/** What a screen reader hears: the explanation of what the learner did, not only a verdict. */
function feedbackText(step: PracticeStep, a: Attempt): string {
  const ex = step.exercise
  const plain = (s: string) => s.replace(/[*`]/g, '')
  switch (ex.type) {
    case 'single': {
      const r = a.response
      return plain(r.type === 'single' ? ex.options[r.option].why : '')
    }
    case 'multi': {
      const r = a.response
      return plain(r.type === 'multi' ? r.options.map((i) => ex.options[i].why).join(' ') : '')
    }
    case 'match':
      return plain(ex.pairs.map((p) => p.why).join(' '))
    case 'flashcards':
      return ''
    default:
      return plain(ex.why)
  }
}

/* ---------- lab ---------- */

function LabBody({ step, progress, setProgress }: { step: LabStep; progress: Progress; setProgress: (fn: (p: Progress) => Progress) => void }) {
  const ui = useUi()
  const done = useMemo(() => new Set(progress.labs[step.id] ?? []), [progress.labs, step.id])
  const complete = useCallback(
    (id: string) =>
      setProgress((p) => {
        const list = p.labs[step.id] ?? []
        return list.includes(id) ? p : { ...p, labs: { ...p.labs, [step.id]: [...list, id] } }
      }),
    [setProgress, step.id],
  )
  const active = step.tasks.find((t) => !done.has(t.id))
  const tasks = (action?: (t: LabTask) => ReactElement | null) => (
    <div className="c-tasks">
      <p className="c-tasks__head">
        <b>{ui.tasksTitle}</b>
        <span>{done.size >= step.tasks.length ? ui.allDone : ui.tasksDone(done.size, step.tasks.length)}</span>
      </p>
      <ol>
        {step.tasks.map((t, i) => {
          const isDone = done.has(t.id)
          return (
            <li key={t.id} data-task={t.id} data-state={isDone ? 'done' : t === active ? 'active' : 'todo'}>
              <span className="c-tasks__mark" aria-hidden="true">
                {isDone ? <Icon name="check" size={16} variant="linear" /> : i + 1}
              </span>
              <div>
                <p>
                  <Rich text={t.text} />
                  {isDone && <span className="c-sr"> {ui.taskDone}</span>}
                </p>
                {isDone && (
                  <p className="c-tasks__why" data-why>
                    <Rich text={t.why} />
                  </p>
                )}
                {!isDone && t === active && action?.(t)}
              </div>
            </li>
          )
        })}
      </ol>
      <span className="c-sr" role="status" data-feedback>
        {[...done].length ? step.tasks.find((t) => t.id === [...done][done.size - 1])?.why.replace(/[*`]/g, '') : ''}
      </span>
    </div>
  )
  return (
    <div className="c-lab" data-lab={step.id}>
      <h1 tabIndex={-1}>{step.title}</h1>
      <p className="c-lab__sim" data-simulation>
        <Icon name="test" size={18} />
        <span>
          <b>{ui.simulation}</b>
          {step.simulation}
        </span>
      </p>
      <p className="c-lead">
        <Rich text={step.lead} />
      </p>
      {step.render({ done, complete, active, tasks })}
    </div>
  )
}

/* ---------- retry and review rounds ---------- */

function isCardsDone(p: Progress, id: string) {
  const run = p.drill?.cards[id]
  return !!run && run.queue.length === 0
}

function DrillView({ course, n, steps, progress, setProgress, numbers }: { course: CourseDef; n: number; steps: Step[]; progress: Progress; setProgress: (fn: (p: Progress) => Progress) => void; numbers: Map<string, number> }) {
  const ui = useUi()
  const drill = progress.drill
  const id = drill?.ids[n]
  const step = steps.find((s) => s.id === id)
  useEffect(() => {
    if (!drill || !step) go('#/finish')
  }, [drill, step])
  if (!drill || !step || step.kind !== 'practice') return null
  const total = drill.ids.length
  const kicker = drill.kind === 'retry' ? ui.drillOf(n + 1, total) : ui.reviewOf(n + 1, total)
  const review = course.concepts[step.concept]?.review
  const prev = n > 0 ? `#/drill/${n - 1}` : '#/finish'
  const last = n >= total - 1
  const next = last ? '#/finish' : `#/drill/${n + 1}`
  const endDrill = () => {
    if (!last) return
    setProgress((p) => {
      if (!p.drill) return p
      const reviewed = p.drill.ids.filter((x) => x in p.drill!.answers)
      const right = reviewed.filter((x) => p.drill!.answers[x].ok).length
      return { ...p, drill: undefined, reviews: p.drill.kind === 'review' ? [...p.reviews, { at: Date.now(), right, total: reviewed.length }] : p.reviews }
    })
  }
  return (
    <article className="c-step" data-step={step.id} data-kind="practice" data-mode={drill.kind}>
      <p className="c-eyebrow">
        {review && (
          <a href={hrefOf(review)} data-action="review-link">
            {ui.reviewLink}
          </a>
        )}
      </p>
      {step.exercise.type === 'flashcards' ? (
        <>
          <h1 tabIndex={-1} className="c-kicker">
            {kicker}
          </h1>
          <Cards
            step={step}
            run={drill.cards[step.id]}
            cards={progress.cards[step.id]?.again ?? []}
            onRun={(run) =>
              setProgress((p) => {
                if (!p.drill) return p
                const again = run.queue.length ? p.cards[step.id]?.again : run.again
                return { ...p, drill: { ...p.drill, cards: { ...p.drill.cards, [step.id]: run } }, cards: { ...p.cards, [step.id]: { ...(p.cards[step.id] ?? startRun([])), again: again ?? [] } } }
              })
            }
          />
          <div onClickCapture={endDrill}>
            <ActionBar prev={prev}>
              <a className="c-btn c-btn--primary" href={next} data-action="next">
                <span>{last ? ui.toResults : ui.next}</span>
                <Arrow />
              </a>
            </ActionBar>
          </div>
        </>
      ) : (
        <div onClickCapture={(e) => (e.target as HTMLElement).closest('[data-action="next"]') && endDrill()}>
          <Practice
            key={`${step.id}:${drill.round}`}
            course={course}
            step={step}
            seed={`${step.id}:${drill.round}`}
            attempt={drill.answers[step.id]}
            prev={prev}
            next={next}
            nextLabel={last ? ui.toResults : ui.next}
            numbers={numbers}
            kicker={kicker}
            onAnswer={(a) =>
              setProgress((p) => {
                if (!p.drill) return p
                return { ...p, drill: { ...p.drill, answers: { ...p.drill.answers, [step.id]: a } }, latest: { ...p.latest, [step.id]: a.ok } }
              })
            }
          />
        </div>
      )}
    </article>
  )
}

/* ---------- results ---------- */

const DAY = 86400000

function Finish({ course, steps, progress, setProgress, storage, onReset }: { course: CourseDef; steps: Step[]; progress: Progress; setProgress: (fn: (p: Progress) => Progress) => void; storage: StorageState; onReset: () => void }) {
  const ui = useUi()
  const scored = steps.filter(isScored)
  const answered = scored.filter((s) => s.id in progress.first)
  const right = answered.filter((s) => progress.first[s.id].ok)
  const missing = scored.filter((s) => !(s.id in progress.first))
  const wrongNow = answered.filter((s) => !(progress.latest[s.id] ?? progress.first[s.id].ok))
  const againCards = steps.filter((s): s is PracticeStep => s.kind === 'practice' && s.exercise.type === 'flashcards' && (progress.cards[s.id]?.again?.length ?? 0) > 0)
  const retry = [...wrongNow, ...missing, ...againCards]
  const finished = missing.length === 0
  const [confirm, setConfirm] = useState(false)

  // The clock for "come back in a few days" starts when the last question is answered.
  useEffect(() => {
    if (finished && !progress.finishedAt) setProgress((p) => ({ ...p, finishedAt: Date.now() }))
  }, [finished, progress.finishedAt, setProgress])

  const begin = (kind: 'retry' | 'review') => {
    const round = progress.rounds + 1
    const ids =
      kind === 'retry'
        ? shuffled(retry.map((s) => s.id), `retry:${round}`)
        : shuffled(
            [...scored].sort((a, b) => Number(progress.latest[a.id] ?? false) - Number(progress.latest[b.id] ?? false)).slice(0, 8).map((s) => s.id),
            `review:${round}`,
          )
    setProgress((p) => ({ ...p, rounds: round, drill: { kind, ids, round, answers: {}, cards: {} } }))
    go('#/drill/0')
  }
  const days = progress.finishedAt ? Math.floor((Date.now() - progress.finishedAt) / DAY) : null
  const concepts = Object.entries(course.concepts)
  const lastReview = progress.reviews[progress.reviews.length - 1]
  return (
    <article className="c-finish" data-finish={finished ? 'done' : 'partial'} data-right={right.length} data-total={scored.length} data-retry={retry.length}>
      <p className="c-eyebrow">{course.title}</p>
      <h1 tabIndex={-1}>{finished ? ui.finishTitle : ui.unfinishedTitle}</h1>
      <p className="c-finish__score" data-score>
        {ui.firstScore(right.length, scored.length)}
        {missing.length > 0 && <span>{ui.unanswered(missing.length)}</span>}
      </p>
      <p className="c-print-only">
        {ui.printedOn}: {new Date().toLocaleDateString(course.lang === 'en' ? 'en' : 'zh-CN')}
      </p>
      <div className="c-finish__actions">
        {missing.length > 0 && (
          <a className="c-btn c-btn--primary" href={hrefOf(missing[0].id)} data-action="go-unanswered">
            {ui.goUnanswered}
          </a>
        )}
        {finished &&
          (retry.length ? (
            <button type="button" className="c-btn c-btn--primary" data-action="retry" onClick={() => begin('retry')}>
              {ui.retryWrong(retry.length)}
            </button>
          ) : (
            <span className="c-finish__clean" data-action-none>
              {ui.noWrong}
            </span>
          ))}
        {finished && (
          <button type="button" className="c-btn c-btn--ghost" data-action="review" onClick={() => begin('review')}>
            {ui.reviewRound}
          </button>
        )}
        <button type="button" className="c-btn c-btn--ghost" data-action="print" onClick={() => print()}>
          {ui.print}
        </button>
      </div>
      <table className="c-results">
        <thead>
          <tr>
            <th scope="col">{ui.concept}</th>
            <th scope="col">{ui.firstCol}</th>
            <th scope="col">{ui.nowCol}</th>
            <th scope="col">
              <span className="c-sr">{ui.reviewLink}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {concepts.map(([key, c]) => {
            const items = scored.filter((s) => s.concept === key)
            const lab = steps.find((s): s is LabStep => s.kind === 'lab' && s.concept === key)
            const first = items.filter((s) => progress.first[s.id]?.ok).length
            const now = items.filter((s) => progress.latest[s.id]).length
            return (
              <tr key={key} data-concept={key} data-first={first} data-now={now} data-of={items.length}>
                <th scope="row">
                  {c.label}
                  {lab && <small>{ui.labDone(progress.labs[lab.id]?.length ?? 0, lab.tasks.length)}</small>}
                </th>
                <td>
                  <Marks items={items} get={(s) => progress.first[s.id]?.ok} />
                  <span className="c-results__n">
                    {first}/{items.length}
                  </span>
                </td>
                <td>
                  <Marks items={items} get={(s) => progress.latest[s.id]} />
                  <span className="c-results__n">
                    {now}/{items.length}
                  </span>
                </td>
                <td>
                  <a href={hrefOf(c.review)}>{ui.reviewLink}</a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {wrongNow.length + answered.filter((s) => !progress.first[s.id].ok).length > 0 && (
        <section className="c-missed">
          <h2>{ui.missedTitle}</h2>
          <ol>
            {answered
              .filter((s) => !progress.first[s.id].ok)
              .map((s) => (
                <li key={s.id} data-missed={s.id}>
                  <p>
                    <Rich text={promptOf(s.exercise)} />
                  </p>
                  <p className="c-missed__a">
                    <b>{ui.answerPrefix}</b>
                    <Rich text={answerText(s.exercise, ui.yes, ui.no)} />
                  </p>
                </li>
              ))}
          </ol>
        </section>
      )}
      <section className="c-spacing">
        <h2>{ui.spacingTitle}</h2>
        <p>{ui.spacingBody}</p>
        {days !== null && <p data-days={days}>{ui.daysAgo(days)}</p>}
        {lastReview && <p data-last-review>{ui.reviewHistory(lastReview.right, lastReview.total)}</p>}
        <p data-storage-note={storage}>{storage === 'saved' ? ui.savedNote : ui.memoryNote}</p>
        {creditOn(course.attribution) && (
          <p className="c-credit">
            <Credit lang={course.lang ?? 'zh'} withUrl />
          </p>
        )}
      </section>
      <div className="c-finish__foot">
        <a className="c-btn c-btn--quiet" href={hrefOf(steps[steps.length - 1].id)} data-action="prev">
          <Arrow back />
          <span>{ui.backToLesson}</span>
        </a>
        <button
          type="button"
          className="c-btn c-btn--quiet"
          data-action="reset"
          onClick={() => {
            if (!confirm) return setConfirm(true)
            onReset()
            go('#/start')
          }}
        >
          {confirm ? ui.restartConfirm : ui.restart}
        </button>
      </div>
    </article>
  )
}

function Marks({ items, get }: { items: PracticeStep[]; get: (s: PracticeStep) => boolean | undefined }) {
  const ui = useUi()
  return (
    <span className="c-marks">
      {items.map((s) => {
        const v = get(s)
        return (
          <i key={s.id} data-mark={v === undefined ? 'none' : v ? 'right' : 'wrong'} title={v === undefined ? ui.markNone : v ? ui.markRight : ui.markWrong}>
            {v === undefined ? '' : <Icon name={v ? 'check' : 'close'} size={12} variant="linear" />}
          </i>
        )
      })}
    </span>
  )
}

/* ---------- sources ---------- */

/** Behind the design of every course: shown so a learner can check the method as well as the content. */
const METHOD: Source[] = [
  { org: 'Rowland 2014', title: 'The effect of testing versus restudy on retention: a meta-analytic review of the testing effect. Psychological Bulletin 140(6)', url: 'https://pubmed.ncbi.nlm.nih.gov/25150680/' },
  { org: 'Van der Kleij, Feskens & Eggen 2015', title: "Effects of feedback in a computer-based learning environment on students' learning outcomes: a meta-analysis. Review of Educational Research 85(4)", url: 'https://doi.org/10.3102/0034654314564881' },
  { org: 'Cepeda et al. 2008', title: 'Spacing effects in learning: a temporal ridgeline of optimal retention. Psychological Science 19(11)', url: 'https://pubmed.ncbi.nlm.nih.gov/19076480/' },
  { org: 'Richland, Kornell & Kao 2009', title: 'The pretesting effect: do unsuccessful retrieval attempts enhance learning? Journal of Experimental Psychology: Applied 15(3)', url: 'https://learninglab.uchicago.edu/Pre-Testing_files/RichlandKornellKao.pdf' },
]

function SourceRow({ n, s }: { n?: number; s: Source }) {
  return (
    <li value={n} data-source>
      <b>{s.org}</b> {s.title}
      {s.url && (
        <>
          {' '}
          <a href={s.url} target="_blank" rel="noreferrer">
            {s.url.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        </>
      )}
      {s.note && <span className="c-sources__note"> {s.note}</span>}
    </li>
  )
}

function Sources({ course, numbers }: { course: CourseDef; numbers: Map<string, number> }) {
  const ui = useUi()
  const entries = [...numbers.entries()].sort((a, b) => a[1] - b[1])
  return (
    <article className="c-sources" data-sources={entries.length}>
      <h1 tabIndex={-1}>{ui.sourcesTitle}</h1>
      <p className="c-lead">{ui.sourcesLead}</p>
      <h2>{ui.sourcesContent}</h2>
      <ol>
        {entries.map(([key, n]) => (
          <SourceRow key={key} n={n} s={course.sources[key]} />
        ))}
      </ol>
      <h2>{ui.sourcesMethod}</h2>
      <ul>
        {METHOD.map((s) => (
          <SourceRow key={s.org} s={s} />
        ))}
      </ul>
      <p className="c-sources__back">
        <a className="c-btn c-btn--ghost" href={course.sections[0] ? '#/start' : '#/'} data-action="home">
          {ui.backHome}
        </a>
      </p>
    </article>
  )
}
