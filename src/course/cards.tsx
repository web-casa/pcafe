// Flashcards: recall first, then look. Self-rated, so never part of the score
// (learners overrate themselves: plans/research-course.md).
import { Icon } from '../kit/Icon'
import { Rich } from './blocks'
import { useUi } from './i18n'
import type { CardRun } from './store'
import type { PracticeStep } from './types'

export const startRun = (cards: number[]): CardRun => ({ queue: cards, known: [], again: [] })

export function Cards({ step, run, cards, onRun }: { step: PracticeStep; run?: CardRun; cards: number[]; onRun: (r: CardRun) => void }) {
  const ui = useUi()
  if (step.exercise.type !== 'flashcards') return null
  const deck = step.exercise.cards
  const current = run ?? startRun(cards)
  const total = current.queue.length + current.known.length + current.again.length
  const at = current.queue[0]
  const card = at === undefined ? undefined : deck[at]
  const finished = at === undefined && total > 0
  const rate = (known: boolean) => {
    const [head, ...rest] = current.queue
    onRun({ queue: rest, known: known ? [...current.known, head] : current.known, again: known ? current.again : [...current.again, head], flipped: false })
  }
  return (
    <div className="c-ex c-cards" data-ex="flashcards">
      <p className="c-prompt">
        <Rich text={step.exercise.prompt} />
      </p>
      {card && (
        <div className="c-card" data-card={at} data-side={current.flipped ? 'back' : 'front'}>
          <p className="c-card__count">{ui.cardOf(total - current.queue.length + 1, total)}</p>
          <p className="c-card__side">{ui.front}</p>
          <p className="c-card__front">
            <Rich text={card.front} />
          </p>
          <div role="status" data-feedback>
            {current.flipped && (
              <div className="c-card__back" data-why>
                <p className="c-card__side">{ui.back}</p>
                <p>
                  <Rich text={card.back} />
                </p>
              </div>
            )}
          </div>
          {current.flipped ? (
            <div className="c-card__rate">
              <button type="button" className="c-tile" data-state="idle" data-again onClick={() => rate(false)}>
                <Icon name="restart" size={22} />
                <b>{ui.notRecalled}</b>
              </button>
              <button type="button" className="c-tile" data-state="idle" data-know onClick={() => rate(true)}>
                <Icon name="check" size={22} variant="linear" />
                <b>{ui.recalled}</b>
              </button>
            </div>
          ) : (
            <button type="button" className="c-btn c-btn--primary c-card__flip" data-flip onClick={() => onRun({ ...current, flipped: true })}>
              {ui.flip}
            </button>
          )}
        </div>
      )}
      {finished && (
        <div className="c-card c-card--done" data-cards-done role="status">
          <p className="c-card__front">{ui.cardsDone(current.known.length, current.again.length)}</p>
          <p className="c-hint">{ui.cardsNote}</p>
          <button type="button" className="c-btn c-btn--ghost" data-cards-again onClick={() => onRun(startRun(deck.map((_, i) => i)))}>
            {ui.cardsAgain}
          </button>
        </div>
      )}
    </div>
  )
}
