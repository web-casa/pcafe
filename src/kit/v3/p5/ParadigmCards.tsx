import { Reveal } from "../../../deck/primitives";
import { Hint, SlideFoot, SlideHead, type SlideBase } from "../../shared";

export type ParadigmShape = "tree" | "blocks" | "flat";

export interface ParadigmCard {
  /** Small structure sketch on top of the card. */
  shape: ParadigmShape;
  /** ≤ 8 CJK characters. */
  name: string;
  /** ≤ 16 CJK characters. */
  tagline: string;
  /** 2–4 rows; label ≤ 4 字, value ≤ 16 字. Rows with the same label line up across cards. */
  rows: { label: string; value: string }[];
}

export interface ParadigmCardsProps extends SlideBase {
  /** 2–3 cards; each build step brings in one card. */
  cards: ParadigmCard[];
  /** Index of the card to emphasise (accent border). */
  focus?: number;
}

function Sketch({ shape }: { shape: ParadigmShape }) {
  if (shape === "tree")
    return (
      <svg viewBox="0 0 200 90" className="v35par__sk" aria-hidden>
        <path d="M100 18 V40 M40 40 H160 M40 40 V62 M100 40 V62 M160 40 V62" />
        <rect x="84" y="6" width="32" height="16" rx="3" />
        <rect x="24" y="62" width="32" height="16" rx="3" />
        <rect x="84" y="62" width="32" height="16" rx="3" />
        <rect x="144" y="62" width="32" height="16" rx="3" />
      </svg>
    );
  if (shape === "blocks")
    return (
      <svg viewBox="0 0 200 90" className="v35par__sk" aria-hidden>
        {Array.from({ length: 16 }, (_, k) => (
          <rect
            key={k}
            x={22 + (k % 8) * 20}
            y={k < 8 ? 22 : 48}
            width="16"
            height="20"
            rx="2"
            className={k % 5 === 2 ? "on" : ""}
          />
        ))}
      </svg>
    );
  return (
    <svg viewBox="0 0 200 90" className="v35par__sk" aria-hidden>
      <path d="M30 20 h140 l-12 62 h-116 z" />
      {[
        [58, 46],
        [84, 58],
        [110, 44],
        [136, 60],
        [96, 30],
      ].map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r="8" className={k === 2 ? "on" : ""} />
      ))}
    </svg>
  );
}

/** Side-by-side model cards, each topped by a small structure sketch (tree / blocks / flat bucket) with aligned attribute rows. */
export function ParadigmCards({
  kicker,
  title,
  lead,
  cards,
  focus,
  source,
  hint,
}: ParadigmCardsProps) {
  return (
    <section className="slide">
      <Hint id="paradigmcards">{hint}</Hint>
      <div className="frame v35-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div
          className="v35par"
          style={{
            gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((c, i) => (
            <Reveal key={i} i={3 + i} className="v35par__slot">
              <article
                className={`v35par__card${focus === i ? " is-focus" : ""}`}
                data-build=""
              >
                <Sketch shape={c.shape} />
                <h3>{c.name}</h3>
                <p className="v35par__tag">{c.tagline}</p>
                <dl>
                  {c.rows.map((r, k) => (
                    <div key={k}>
                      <dt>{r.label}</dt>
                      <dd>{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  );
}
