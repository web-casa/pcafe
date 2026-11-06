import { Reveal } from "../../../deck/primitives";
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from "../../shared";

export interface TierStep {
  /** ≤ 14 Latin characters or ≤ 8 CJK characters. */
  name: string;
  /** Small tag, ≤ 6 字. */
  tag?: string;
  /** 2–3 specs; label ≤ 4 字, value ≤ 8 字. */
  specs: { label: string; value: string }[];
}

export interface TierLadderProps extends SlideBase {
  /** 3–5 steps from the top (hot) to the bottom (cold); each build step adds one. */
  steps: TierStep[];
  /** End labels of the ladder, each ≤ 6 字, e.g. ['常用', '归档']. */
  ends?: [string, string];
}

/** Cards laid out as a descending staircase (hot → cold); each build step sets down the next step. */
export function TierLadder({
  kicker,
  title,
  lead,
  steps,
  ends,
  source,
  hint,
}: TierLadderProps) {
  const n = steps.length;
  return (
    <section className="slide">
      <Hint id="tierladder">{hint}</Hint>
      <div className="frame v35-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="v35tier" style={vars({ "--n": n })}>
          <div className="v35tier__grid">
            {steps.map((s, i) => (
              <Reveal
                key={i}
                i={3 + i}
                className="v35tier__slot"
                style={vars({ "--k": i, "--t": n > 1 ? i / (n - 1) : 0 })}
              >
                <article className="v35tier__card" data-build="">
                  <header>
                    <h3>{s.name}</h3>
                    {s.tag && <span className="v35tier__tag">{s.tag}</span>}
                  </header>
                  <dl>
                    {s.specs.map((x, k) => (
                      <div key={k}>
                        <dt>{x.label}</dt>
                        <dd>{x.value}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
          {ends && (
            <Reveal i={3} className="v35tier__ends">
              <span>{ends[0]}</span>
              <i aria-hidden />
              <span>{ends[1]}</span>
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  );
}
