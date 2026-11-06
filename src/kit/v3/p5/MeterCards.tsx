import { Reveal } from "../../../deck/primitives";
import { Icon, type IconName } from "../../Icon";
import { Hint, SlideFoot, SlideHead, type SlideBase } from "../../shared";

export interface MeterCard {
  icon: IconName;
  /** Dimension name, ≤ 8 字. */
  name: string;
  /** Billing unit in large type, ≤ 8 characters (e.g. “GB·月”). */
  unit: string;
  /** ≤ 40 CJK characters. */
  note: string;
}

export interface MeterCardsProps extends SlideBase {
  /** 3–5 cards; each build step adds one. */
  cards: MeterCard[];
  /** Label above each unit, ≤ 4 字. Default “计量”. */
  unitLabel?: string;
}

/** Cards that each name one billing dimension with its unit set large, like a meter face. */
export function MeterCards({
  kicker,
  title,
  lead,
  cards,
  unitLabel = "计量",
  source,
  hint,
}: MeterCardsProps) {
  return (
    <section className="slide">
      <Hint id="metercards">{hint}</Hint>
      <div className="frame v35-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div
          className="v35met"
          style={{
            gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((c, i) => (
            <Reveal key={i} i={3 + i} className="v35met__slot">
              <article className="v35met__card" data-build="">
                <header>
                  <Icon
                    name={c.icon}
                    size={40}
                    tone={i === 0 ? "accent" : "ink"}
                  />
                  <h3>{c.name}</h3>
                </header>
                <div className="v35met__face">
                  <small>{unitLabel}</small>
                  <b>{c.unit}</b>
                </div>
                <p>{c.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  );
}
