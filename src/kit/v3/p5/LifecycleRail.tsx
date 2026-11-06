import { Reveal } from "../../../deck/primitives";
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from "../../shared";

export interface RailStop {
  /** Position label on the ruler, ≤ 8 characters (e.g. “第 30 天”). */
  at: string;
  /** ≤ 12 Latin characters or ≤ 8 CJK characters. */
  title: string;
  /** ≤ 32 CJK characters. */
  body: string;
}

export interface LifecycleRailProps extends SlideBase {
  /** 3–5 stops left to right; each build step moves the marker to the next stop. */
  stops: RailStop[];
  /** Text on the moving marker, ≤ 10 Latin characters. */
  marker: string;
}

/** A ruler with stops; a marker block travels stop to stop as you step, and each stop's card drops in. */
export function LifecycleRail({
  kicker,
  title,
  lead,
  stops,
  marker,
  source,
  hint,
}: LifecycleRailProps) {
  const n = stops.length;
  return (
    <section className="slide">
      <Hint id="lifecyclerail">{hint}</Hint>
      <div className="frame v35-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v35rail" style={vars({ "--n": n })}>
          <div className="v35rail__track" aria-hidden>
            <i />
          </div>
          <div className="v35rail__stops">
            {stops.map((s, i) => (
              <div
                key={i}
                className="v35rail__stop"
                data-build={i === 0 ? undefined : ""}
              >
                <span className="v35rail__chip" aria-hidden>
                  {marker}
                </span>
                <span className="v35rail__dot" aria-hidden />
                <span className="v35rail__at">{s.at}</span>
                <div className="v35rail__card">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  );
}
