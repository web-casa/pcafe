import { Reveal } from "../../../deck/primitives";
import { Hint, SlideFoot, SlideHead, type SlideBase } from "../../shared";

export interface AnatomyPart {
  /** Part name, ≤ 8 CJK characters. */
  name: string;
  /** Sample value shown inside the card strip (monospace), ≤ 36 Latin characters per line, ≤ 3 lines. */
  sample: string[];
  /** Explanation on the right, ≤ 40 CJK characters. */
  note: string;
  /** Relative height of the strip, 1–3. Default 1. */
  weight?: number;
}

export interface AnatomyCardProps extends SlideBase {
  /** Label on the card's tab, ≤ 24 Latin characters. */
  label: string;
  /** 2–4 parts from top to bottom; each build step lights one part and its note. */
  parts: AnatomyPart[];
}

/** One large card cut into labelled strips (e.g. key / data / metadata); each step lights a strip and its callout. */
export function AnatomyCard({
  kicker,
  title,
  lead,
  label,
  parts,
  source,
  hint,
}: AnatomyCardProps) {
  return (
    <section className="slide">
      <Hint id="anatomycard">{hint}</Hint>
      <div className="frame v35-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v35ana">
          <div className="v35ana__card">
            <span className="v35ana__tab">{label}</span>
            {parts.map((p, i) => (
              <div
                key={i}
                className="v35ana__strip"
                data-build={`ana-${i}`}
                style={{ flexGrow: p.weight ?? 1 }}
              >
                <span className="v35ana__no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <code>
                  {p.sample.map((l, k) => (
                    <span key={k}>{l}</span>
                  ))}
                </code>
              </div>
            ))}
          </div>
          <ol className="v35ana__notes">
            {parts.map((p, i) => (
              <li
                key={i}
                data-build={`ana-${i}`}
                style={{ flexGrow: p.weight ?? 1 }}
              >
                <b>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {p.name}
                </b>
                <p>{p.note}</p>
              </li>
            ))}
          </ol>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  );
}
