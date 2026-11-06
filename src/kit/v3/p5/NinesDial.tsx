import { Reveal } from "../../../deck/primitives";
import { Hint, SlideFoot, SlideHead, type SlideBase } from "../../shared";

export interface NinesMark {
  /** How many nines are lit after this step (cumulative, ascending). */
  upto: number;
  /** Caption for this step, e.g. “两个九 = 99%”, ≤ 10 字. */
  label: string;
  /** ≤ 36 CJK characters. */
  note: string;
}

export interface NinesDialProps extends SlideBase {
  /** Total number of nines in the figure, 2–11. 11 renders 99.999999999%. */
  nines: number;
  /** What the figure measures, ≤ 12 字, shown under the digits. */
  caption: string;
  /** 2–4 steps; each lights the nines up to `upto` and shows its note. */
  marks: NinesMark[];
}

/** A row of digit tiles spelling a “nines” percentage; each build step lights the next group of nines and explains it. */
export function NinesDial({
  kicker,
  title,
  lead,
  nines,
  caption,
  marks,
  source,
  hint,
}: NinesDialProps) {
  const n = Math.max(2, Math.min(11, nines));
  const groupOf = (k: number) => {
    const g = marks.findIndex((m) => k < m.upto);
    return g < 0 ? marks.length - 1 : g;
  };
  const cells: { ch: string; k: number | null }[] = [];
  for (let k = 0; k < n; k++) {
    cells.push({ ch: "9", k });
    if (k === 1) cells.push({ ch: ".", k: null });
  }
  cells.push({ ch: "%", k: null });
  return (
    <section className="slide">
      <Hint id="ninesdial">{hint}</Hint>
      <div className="frame v35-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v35nine">
          <div
            className="v35nine__row"
            role="img"
            aria-label={`${"99."}${"9".repeat(n - 2)}%`}
          >
            {cells.map((c, i) =>
              c.k === null ? (
                <span key={i} className="v35nine__sep" aria-hidden>
                  {c.ch}
                </span>
              ) : (
                <span
                  key={i}
                  className="v35nine__cell"
                  data-build={`nine-${groupOf(c.k)}`}
                  aria-hidden
                >
                  {c.ch}
                </span>
              ),
            )}
          </div>
          <p className="v35nine__cap">{caption}</p>
          <ol
            className="v35nine__marks"
            style={{
              gridTemplateColumns: `repeat(${marks.length}, minmax(0, 1fr))`,
            }}
          >
            {marks.map((m, i) => (
              <li key={i} data-build={`nine-${i}`}>
                <b>{m.label}</b>
                <p>{m.note}</p>
              </li>
            ))}
          </ol>
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  );
}
