import { Reveal } from "../../../deck/primitives";
import { Hint, SlideFoot, SlideHead, type SlideBase } from "../../shared";
import { Photo, type PhotoImage } from "../../v2/p1/img";

export interface ShelfItem {
  /** `decor-` illustration or real screenshot. */
  image: PhotoImage;
  /** ≤ 8 字. */
  title: string;
  /** ≤ 36 CJK characters. */
  body: string;
}

export interface ShelfGalleryProps extends SlideBase {
  /** 3–4 items; each build step lifts the next one forward. */
  items: ShelfItem[];
}

/** A gallery shelf of image cards; the card in focus grows and lifts while the others step back. */
export function ShelfGallery({
  kicker,
  title,
  lead,
  items,
  source,
  hint,
}: ShelfGalleryProps) {
  return (
    <section className="slide">
      <Hint id="shelfgallery">{hint}</Hint>
      <div className="frame v35-frame">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="v35shelf">
          {items.map((it, i) => (
            <article
              key={i}
              className="v35shelf__card"
              data-build={i === 0 ? undefined : ""}
            >
              <Photo image={it.image} className="v35shelf__img" />
              <div className="v35shelf__txt">
                <span className="v35shelf__no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{it.title}</h3>
                <p>{it.body}</p>
              </div>
            </article>
          ))}
        </Reveal>
        <SlideFoot source={source} />
      </div>
    </section>
  );
}
