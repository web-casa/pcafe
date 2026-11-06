import { Reveal } from "../../../deck/primitives";
import { Hint, SlideFoot, SlideHead, type SlideBase } from "../../shared";

export interface TabSpecItem {
  /** Tab label, ≤ 12 Latin characters or ≤ 6 字. */
  tab: string;
  /** Card heading, ≤ 16 字. */
  name: string;
  /** ≤ 60 CJK characters. */
  body: string;
  /** 2–4 spec rows; label ≤ 4 字, value ≤ 22 字. */
  specs: { label: string; value: string }[];
}

export interface TabSpecProps extends SlideBase {
  /** 2–4 tabs; each build step switches to the next tab. */
  items: TabSpecItem[];
}

/** A tabbed card: one spec card shows at a time and each build step switches to the next tab, like a carousel. */
export function TabSpec({
  kicker,
  title,
  lead,
  items,
  source,
  hint,
}: TabSpecProps) {
  return (
    <section className="slide">
      <Hint id="tabspec">{hint}</Hint>
      <div className="frame v35-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v35tab">
          {items.map((it, i) => (
            <div
              key={i}
              className="v35tab__panel"
              data-build={i === 0 ? undefined : ""}
            >
              <nav
                className="v35tab__tabs"
                aria-hidden={i !== items.length - 1}
              >
                {items.map((t, k) => (
                  <span key={k} className={k === i ? "is-on" : ""}>
                    {t.tab}
                  </span>
                ))}
              </nav>
              <div className="v35tab__card">
                <div className="v35tab__main">
                  <span className="v35tab__no">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(items.length).padStart(2, "0")}
                  </span>
                  <h3>{it.name}</h3>
                  <p>{it.body}</p>
                </div>
                <dl>
                  {it.specs.map((s, k) => (
                    <div key={k}>
                      <dt>{s.label}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ))}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  );
}
