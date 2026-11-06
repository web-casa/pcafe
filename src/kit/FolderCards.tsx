import { Reveal } from '../deck/primitives'
import { pad2 } from '../deck/motion'
import { FileTag } from './decor'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface FolderItem {
  /** Tab text, ≤ 10 characters, e.g. 'PROJECT 01'. Defaults to the index. */
  tab?: string
  /** ≤ 14 CJK characters. */
  title: string
  /** ≤ 60 CJK characters. */
  body: string
  /** 0–3 short points, ≤ 16 CJK characters each. */
  points?: string[]
  /** A real screenshot on the right half of the folder. */
  src?: string
  alt?: string
  /** File name tag on the screenshot. */
  file?: string
}

export interface FolderCardsProps extends SlideBase {
  /** 3–4 folders. With build: 'focus' the next one comes to the front on each →. */
  items: FolderItem[]
}

/** Stacked folders with staggered tabs; the front folder shows its content. */
export function FolderCards({ kicker, title, lead, source, hint, items }: FolderCardsProps) {
  return (
    <section className="slide">
      <Hint id="folders">{hint}</Hint>
      <div className="frame s-folders">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <Reveal i={3} className="folders" style={vars({ '--n': items.length })}>
          {items.map((it, i) => (
            <article key={it.title} className={`folder folder--s${(i % 5) + 2}`} data-build={i} style={vars({ '--k': i })}>
              <span className="folder__tab">{it.tab ?? `PROJECT ${pad2(i + 1)}`}</span>
              <div className="folder__body">
                <div className="folder__copy">
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                  {it.points && it.points.length > 0 && (
                    <ul>
                      {it.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {it.src && (
                  <div className="folder__img" data-crop>
                    <img src={it.src} alt={it.alt ?? ''} draggable={false} />
                    {it.file && <FileTag name={it.file} />}
                  </div>
                )}
              </div>
            </article>
          ))}
        </Reveal>
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
