import { Reveal } from '../../../deck/primitives'
import { Hint, SlideHead, SlideFoot, type SlideBase } from '../../shared'
import { Photo, type PhotoImage } from './img'

export interface MosaicTile {
  image: PhotoImage
  /** ≤ 12 字, set on the photo. */
  caption?: string
}

export interface PhotoMosaicProps extends SlideBase {
  /** 3–5 photos. The first one takes the big cell. */
  tiles: MosaicTile[]
}

/** Asymmetric photo grid of 3–5 images under a slide head; each tile is a build step. */
export function PhotoMosaic({ kicker, title, lead, tiles, source, hint }: PhotoMosaicProps) {
  const t = tiles.slice(0, 5)
  return (
    <section className="slide">
      <Hint id="photomosaic">{hint}</Hint>
      <div className="frame v21-mosaic">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className={`v21-mosaic__grid v21-mosaic__grid--${t.length}`}>
          {t.map((tile, i) => (
            <Reveal key={i} i={3 + i} build className="v21-mosaic__tile">
              <Photo image={tile.image} />
              {tile.caption && <span className="v21-mosaic__cap">{tile.caption}</span>}
            </Reveal>
          ))}
        </div>
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
