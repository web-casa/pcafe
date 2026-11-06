import { Reveal } from "../../../deck/primitives";
import { Icon } from "../../Icon";
import { Hint, SlideFoot, SlideHead, type SlideBase } from "../../shared";

export interface ExplorerRow {
  /** Name in the folder view, ≤ 24 Latin characters. A trailing “/” draws a folder. */
  name: string;
  /** Full flat key shown after the flip, ≤ 40 Latin characters. */
  key: string;
  /** Size or count, ≤ 10 characters. */
  size?: string;
}

export interface ExplorerFlipProps extends SlideBase {
  /** Window path / bucket name, ≤ 32 Latin characters. */
  path: string;
  /** 3–6 rows. */
  rows: ExplorerRow[];
  /** Tab labels for the two views, each ≤ 6 字. */
  views?: [string, string];
  /** Note shown beside the window after the flip, ≤ 60 CJK characters. */
  note?: string;
}

/** A file-browser window: first the familiar folder view, then one build step flips every row to its full flat key. */
export function ExplorerFlip({
  kicker,
  title,
  lead,
  path,
  rows,
  views = ["文件夹视图", "实际的键"],
  note,
  source,
  hint,
}: ExplorerFlipProps) {
  return (
    <section className="slide">
      <Hint id="explorerflip">{hint}</Hint>
      <div className="frame v35-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v35exp">
          <div className="v35exp__win" data-build="">
            <div className="v35exp__bar">
              <i aria-hidden />
              <i aria-hidden />
              <i aria-hidden />
              <code>{path}</code>
              <span className="v35exp__views">
                <em className="v35exp__v0">{views[0]}</em>
                <em className="v35exp__v1">{views[1]}</em>
              </span>
            </div>
            <ul>
              {rows.map((r, i) => {
                const folder = r.name.endsWith("/");
                return (
                  <li key={i} style={{ transitionDelay: `${i * 60}ms` }}>
                    <span className="v35exp__ic">
                      <span className="v35exp__dir">
                        <Icon
                          name={folder ? "folder" : "document"}
                          size={32}
                          tone={folder ? "accent" : "mute"}
                        />
                      </span>
                      <span className="v35exp__doc">
                        <Icon name="document" size={32} tone="mute" />
                      </span>
                    </span>
                    <span className="v35exp__name">
                      <span className="v35exp__a">{r.name}</span>
                      <span className="v35exp__b">{r.key}</span>
                    </span>
                    <span className="v35exp__size">{r.size}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          {note && (
            <p className="v35exp__note" data-build="">
              {note}
            </p>
          )}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  );
}
