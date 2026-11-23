import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'
import { Brackets, Corners, type MarkerCorners } from './parts'

export interface MarkerWork {
  /** ≤ 6 字. */
  name: string
  /** Mono number, e.g. "001", ≤ 4 个字符. */
  no?: string
  /** Mono line at the foot, e.g. "2024", ≤ 10 个字符. */
  year?: string
  /** Portrait-ish product picture. */
  image: PhotoImage
}

export interface MarkerWorksProps {
  /** Mono label above, ≤ 10 字. */
  kicker: string
  /** 3–9 pieces, shown three at a time; the arrows page through. */
  works: MarkerWork[]
  corners?: MarkerCorners
  hint?: string
}

/** Selected work as three soft grey cards, each picture held in bracket corners; arrows page through more in threes. */
export function MarkerWorks({ kicker, works, corners, hint }: MarkerWorksProps) {
  const list = works.slice(0, 9)
  const pages = Math.max(1, Math.ceil(list.length / 3))
  const [page, setPage] = useState(0)
  return (
    <section className="slide mr">
      <Hint id="markerworks">{hint}</Hint>
      <div className="mr-col mr-wide">
        <Reveal i={0} className="mr-k">
          {kicker}
        </Reveal>
        <div className="mr-pager" data-crop>
          <div className="mr-pager__track" style={{ transform: `translateX(${-page * 100}%)` }}>
            {Array.from({ length: pages }, (_, p) => (
              <div className="mr-cards" key={p} aria-hidden={p === page ? undefined : true}>
                {list.slice(p * 3, p * 3 + 3).map((w, k) => (
                  <Reveal i={1 + k * 0.5} y={24} key={w.name}>
                    <article className="mr-card">
                      <header>
                        {w.name}
                        {w.no && <span>{w.no}</span>}
                      </header>
                      <Brackets className="mr-card__fr">
                        <Photo image={w.image} className="mr-card__img" />
                      </Brackets>
                      {w.year && <footer>{w.year}</footer>}
                    </article>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {pages > 1 && (
        <div className="mr-arrows">
          <button type="button" aria-label="上一页" disabled={page === 0} onClick={() => setPage(page - 1)}>
            ‹
          </button>
          <button type="button" aria-label="下一页" disabled={page === pages - 1} onClick={() => setPage(page + 1)}>
            ›
          </button>
        </div>
      )}
      {corners && <Corners {...corners} left={pages > 1 ? undefined : corners.left} />}
    </section>
  )
}
