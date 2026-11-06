import { Reveal } from '../deck/primitives'
import { MockApp, type MockAppProps } from './mock/Mock'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface AppCardsProps extends SlideBase {
  /** 2–4 filled-in app panels, e.g. the same item on several platforms. */
  cards: Omit<MockAppProps, 'style'>[]
}

/** Several mock app panels side by side, already filled in. With `build: 'reveal'` one appears per press. */
export function AppCards({ kicker, title, lead, source, hint, cards }: AppCardsProps) {
  return (
    <section className="slide">
      <Hint id="appcards">{hint}</Hint>
      <div className="frame s-appcards">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="appcards__row" data-n={cards.length} style={vars({ '--n': cards.length })}>
          {cards.map((c, i) => (
            <div key={c.app + c.title} className="appcards__cell" data-build={i}>
              <Reveal i={3 + i * 0.5} y={20}>
                <MockApp {...c} />
              </Reveal>
            </div>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
