import { Reveal } from "../../../deck/primitives";
import { Hint, SlideFoot, SlideHead, type SlideBase } from "../../shared";

export interface VerbCard {
  /** Method badge, ≤ 6 Latin characters (PUT, GET…). */
  verb: string;
  /** Request line, ≤ 28 Latin characters. */
  path: string;
  /** What it does, ≤ 30 CJK characters. */
  body: string;
  /** Response line printed on the card's build step, ≤ 28 Latin characters. */
  reply: string;
}

export interface VerbCardsProps extends SlideBase {
  /** 3–4 cards; each build step prints one card's response. */
  cards: VerbCard[];
}

/** Request cards: a method badge, a request line and a sentence; each step prints that card's response like a receipt. */
export function VerbCards({
  kicker,
  title,
  lead,
  cards,
  source,
  hint,
}: VerbCardsProps) {
  return (
    <section className="slide">
      <Hint id="verbcards">{hint}</Hint>
      <div className="frame v35-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div
          className="v35verb"
          style={{
            gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((c, i) => (
            <Reveal key={i} i={3 + i} className="v35verb__card">
              <span className="v35verb__badge">{c.verb}</span>
              <code className="v35verb__path">{c.path}</code>
              <p>{c.body}</p>
              <div className="v35verb__reply" data-build="">
                <span aria-hidden>←</span>
                <code>{c.reply}</code>
              </div>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  );
}
