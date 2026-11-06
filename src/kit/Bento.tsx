import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { HeaderHint } from '../deck/Deck'
import { useUnit } from '../deck/Stage'
import { EASE_OUT, MORPH, pad2 } from '../deck/motion'
import { Numeral, usePointerDrift, type Drift } from '../deck/primitives'

const RADIUS = 30
const CLOSE_FADE_MS = 150

export interface BentoCard {
  /** Stable, unique, url-safe. Used for shared-layout ids and QA selectors. */
  id: string
  /**
   * Pre-broken title lines, each short enough not to wrap (the morph scales
   * the title uniformly). Slot 1: 1 line; slots 2–3: ≤ 2 lines × 8 CJK
   * characters; slots 4–6: 1 line ≤ 12 characters.
   */
  title: string[]
  /** One line on the card. Slot 1 may use two sentences. */
  summary: string
  /** Opening paragraph of the detail view, ≤ 70 CJK characters. */
  lead: string
  source: string
  /** Card-sized graphic (slots 2–6). See kit/minis for ready-made ones. */
  mini?: ReactNode
  /** Right-hand column of the expanded detail. See kit/details for building blocks. */
  detail: ReactNode
  /** Foot of the detail's copy column. Overrides `figure`. */
  aside?: ReactNode
  /** Anchoring figure at the foot of the detail's copy column. */
  figure?: { value: string; unit?: string; caption: string }
}

export interface BentoFeature {
  /** Display figure in slot 1, morphs into the detail. 1–3 characters. */
  numeral: string
  codename?: string
  pill?: string
  date?: string
  /** Exactly 3 stats under the summary. Values ≤ 7 characters. */
  stats: { label: string; value: string }[]
}

export interface BentoProps {
  /** Exactly 6 cards. Slot 1 is the feature card (big, left). */
  cards: BentoCard[]
  feature: BentoFeature
  label?: string
}

type Phase = 'overview' | 'detail' | 'closing'

/**
 * Six-card overview where every card expands into a full detail view with a
 * shared-element morph. Use it once per deck, right after the cover.
 */
export function Bento({ cards, feature, label = '总览' }: BentoProps) {
  const [active, setActive] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('overview')
  const [returning, setReturning] = useState<string | null>(null)
  const [introDone, setIntroDone] = useState(false)
  const cardEls = useRef<Record<string, HTMLElement | null>>({})
  const reduce = useReducedMotion()

  useEffect(() => {
    const t = window.setTimeout(() => setIntroDone(true), 1600)
    return () => window.clearTimeout(t)
  }, [])

  const open = useCallback(
    (id: string) => {
      if (phase !== 'overview') return
      setReturning(null)
      setActive(id)
      setPhase('detail')
    },
    [phase],
  )

  const close = useCallback(() => {
    if (phase !== 'detail' || !active) return
    const id = active
    setPhase('closing')
    window.setTimeout(
      () => {
        setActive(null)
        setReturning(id)
        setPhase('overview')
      },
      reduce ? 0 : CLOSE_FADE_MS,
    )
  }, [phase, active, reduce])

  // Return focus once the card has re-mounted in its slot.
  useEffect(() => {
    if (returning) cardEls.current[returning]?.focus({ preventScroll: true })
  }, [returning])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key)) {
        // The sub-scene owns the keyboard: never leak into slide navigation.
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [active, close])

  const activeIndex = cards.findIndex((c) => c.id === active)

  return (
    <section className="slide" aria-label={label} data-phase={phase}>
      <HeaderHint hintKey={active ? 'detail' : 'overview'}>
        {active ? (
          <>
            按 <kbd>Esc</kbd> 返回总览
          </>
        ) : (
          <>
            点击卡片或按 <kbd>Tab</kbd> <kbd>Enter</kbd> 展开详情
          </>
        )}
      </HeaderHint>
      <LayoutGroup>
        <div className="bento">
          {cards.map((card, i) =>
            card.id === active ? (
              <div key={card.id} className={`card-slot slot-${i + 1}`} aria-hidden />
            ) : (
              <BentoCardView
                key={card.id}
                card={card}
                slot={i + 1}
                feature={i === 0 ? feature : undefined}
                intro={!introDone && returning === null}
                returning={returning === card.id}
                locked={active !== null}
                layoutKey={active ?? returning}
                onOpen={open}
                onReturned={() => setReturning((r) => (r === card.id ? null : r))}
                refEl={(el) => {
                  cardEls.current[card.id] = el
                }}
              />
            ),
          )}
          {active && (
            <DetailView
              key={active}
              card={cards[activeIndex]}
              slot={activeIndex + 1}
              total={cards.length}
              feature={activeIndex === 0 ? feature : undefined}
              closing={phase === 'closing'}
              onClose={close}
            />
          )}
        </div>
      </LayoutGroup>
    </section>
  )
}

interface CardProps {
  card: BentoCard
  slot: number
  feature?: BentoFeature
  intro: boolean
  returning: boolean
  locked: boolean
  layoutKey: string | null
  onOpen: (id: string) => void
  onReturned: () => void
  refEl: (el: HTMLElement | null) => void
}

function BentoCardView({ card, slot, feature, intro, returning, locked, layoutKey, onOpen, onReturned, refEl }: CardProps) {
  const u = useUnit()
  const { drift, lean: leanAll, settle } = usePointerDrift()
  const lean: typeof leanAll = (e) => feature && leanAll(e)

  const activate = () => {
    settle()
    onOpen(card.id)
  }

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activate()
    }
  }

  return (
    <motion.article
      ref={refEl}
      layoutId={`card-${card.id}`}
      layoutDependency={layoutKey}
      className={`card slot-${slot}${feature ? ' card--feature' : ''}`}
      data-card={card.id}
      style={{ borderRadius: RADIUS * u, zIndex: returning ? 4 : 1 }}
      role="button"
      tabIndex={locked ? -1 : 0}
      inert={locked}
      aria-label={`展开详情：${card.title.join('')}`}
      onClick={activate}
      onKeyDown={onKeyDown}
      onPointerMove={lean}
      onPointerLeave={settle}
      initial={intro ? { opacity: 0, y: 28 * u } : false}
      animate={{ opacity: locked ? 0.32 : 1, y: 0 }}
      transition={{
        default: intro ? { duration: 0.9, ease: EASE_OUT, delay: 0.18 + (slot - 1) * 0.07 } : { duration: 0.42, ease: EASE_OUT },
        layout: MORPH,
      }}
      onLayoutAnimationComplete={returning ? onReturned : undefined}
    >
      <div className="card__top">
        <motion.span layoutId={`idx-${card.id}`} layoutDependency={layoutKey} transition={{ layout: MORPH }} className="card__idx">
          {pad2(slot)}
        </motion.span>
        <span className="card__open" aria-hidden>
          <i />
          <i />
        </span>
      </div>

      {feature ? (
        <FeatureCardBody card={card} feature={feature} returning={returning} intro={intro} layoutKey={layoutKey} drift={drift} />
      ) : (
        <>
          <Fade className="card__visual" returning={returning}>
            {card.mini}
          </Fade>
          <div className="card__text">
            <CardTitle card={card} layoutKey={layoutKey} className="card__title" />
            <Fade as="p" className="card__summary" returning={returning}>
              {card.summary}
            </Fade>
          </div>
        </>
      )}
    </motion.article>
  )
}

function FeatureCardBody({
  card,
  feature,
  returning,
  intro,
  layoutKey,
  drift,
}: {
  card: BentoCard
  feature: BentoFeature
  returning: boolean
  intro: boolean
  layoutKey: string | null
  drift: Drift
}) {
  return (
    <>
      {(feature.pill || feature.date) && (
        <Fade className="feature__pill" returning={returning}>
          {feature.pill && <span className="pill">{feature.pill}</span>}
          {feature.date && <span className="feature__date">{feature.date}</span>}
        </Fade>
      )}
      <FeatureNumber text={feature.numeral} layoutKey={layoutKey} intro={intro} drift={drift} />
      <div className="feature__copy">
        <CardTitle card={card} layoutKey={layoutKey} className="feature__title" codename={feature.codename} />
        <Fade as="p" className="feature__summary" returning={returning}>
          {card.summary}
        </Fade>
        <Fade as="dl" className="feature__stats" returning={returning}>
          {feature.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </Fade>
      </div>
    </>
  )
}

function FeatureNumber({
  text,
  layoutKey,
  intro,
  drift,
  className = 'feature-num',
}: {
  text: string
  layoutKey: string | null
  intro: boolean
  drift?: Drift
  className?: string
}) {
  return (
    <motion.div layoutId="feature-num" layoutDependency={layoutKey} transition={{ layout: MORPH }} className={`numeral ${className}`} aria-hidden>
      <Numeral text={text} intro={intro} drift={drift} />
    </motion.div>
  )
}

function CardTitle({ card, layoutKey, className, codename, id }: { card: BentoCard; layoutKey: string | null; className: string; codename?: string; id?: string }) {
  return (
    <motion.h3 id={id} layoutId={`title-${card.id}`} layoutDependency={layoutKey} transition={{ layout: MORPH }} className={className}>
      {card.title.map((line, i) => (
        <span className="title-line" key={i}>
          {line}
        </span>
      ))}
      {codename && <em className="codename">“{codename}”</em>}
    </motion.h3>
  )
}

/** Content that is not shared between card and detail fades out of the way of the morph. */
function Fade({ as = 'div', className, returning, children }: { as?: 'div' | 'p' | 'dl'; className: string; returning: boolean; children: ReactNode }) {
  const Tag = motion[as]
  return (
    <Tag className={className} initial={returning ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.32, ease: EASE_OUT, delay: returning ? 0.34 : 0 }}>
      {children}
    </Tag>
  )
}

function DetailView({
  card,
  slot,
  total,
  feature,
  closing,
  onClose,
}: {
  card: BentoCard
  slot: number
  total: number
  feature?: BentoFeature
  closing: boolean
  onClose: () => void
}) {
  const u = useUnit()
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = `detail-title-${card.id}`

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
  }, [])

  const reveal = (i: number) => ({
    initial: { opacity: 0, y: 18 * u },
    animate: closing ? { opacity: 0, y: 0 } : { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0.12 } : closing ? { duration: CLOSE_FADE_MS / 1000, ease: EASE_OUT } : { duration: 0.7, ease: EASE_OUT, delay: 0.3 + i * 0.09 },
  })

  return (
    <motion.article
      layoutId={`card-${card.id}`}
      layoutDependency={card.id}
      transition={{ layout: MORPH }}
      className={`detail${feature ? ' detail--feature' : ''}`}
      data-detail={card.id}
      style={{ borderRadius: RADIUS * u, zIndex: 10 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={(e) => {
        // Trap focus: the only focusable control is the close button.
        if (e.key === 'Tab') {
          e.preventDefault()
          closeRef.current?.focus()
        }
      }}
    >
      <div className="card__top detail__top">
        <motion.span layoutId={`idx-${card.id}`} layoutDependency={card.id} transition={{ layout: MORPH }} className="card__idx">
          {pad2(slot)} <span className="detail__of">/ {pad2(total)}</span>
        </motion.span>
        <motion.button ref={closeRef} type="button" className="detail__close" onClick={onClose} {...reveal(0)}>
          <span>返回总览</span>
          <span className="detail__close-x" aria-hidden>
            <i />
            <i />
          </span>
        </motion.button>
      </div>

      <div className="detail__body">
        <div className="detail__copy">
          {feature ? (
            <div className="detail__hero">
              <FeatureNumber text={feature.numeral} layoutKey={card.id} intro={false} className="feature-num feature-num--detail" />
              <CardTitle card={card} layoutKey={card.id} className="feature__title" codename={feature.codename} id={titleId} />
            </div>
          ) : (
            <CardTitle card={card} layoutKey={card.id} className="detail__title" id={titleId} />
          )}
          <motion.p className="detail__lead" {...reveal(1)}>
            {card.lead}
          </motion.p>
          {card.aside ? (
            <motion.div className="detail__foot" {...reveal(3)}>
              {card.aside}
            </motion.div>
          ) : (
            card.figure && (
              <motion.div className="detail__foot detail__figure" {...reveal(3)}>
                <b>
                  {card.figure.value}
                  {card.figure.unit && <small>{card.figure.unit}</small>}
                </b>
                <span>{card.figure.caption}</span>
              </motion.div>
            )
          )}
          <motion.p className="detail__source" {...reveal(4)}>
            来源 · {card.source}
          </motion.p>
        </div>
        <motion.div className="detail__visual" {...reveal(2)}>
          {card.detail}
        </motion.div>
      </div>
    </motion.article>
  )
}
