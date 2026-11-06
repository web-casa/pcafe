import { Reveal } from '../deck/primitives'
import type { IconName } from './Icon'
import { IconTile, type Spot } from './parts'
import { Shape3D, type ShapeKind } from './shapes'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export interface WallTile {
  icon: IconName
  /** ≤ 6 CJK characters. */
  label: string
  spot?: Spot
}

export interface TileWallProps extends SlideBase {
  /** 6 or 9 tiles, laid out 3 across. */
  tiles: WallTile[]
  /** The object behind the wall. Defaults to a sphere. */
  shape?: ShapeKind
}

/** A 3×3 wall of big icon tiles with a 3D object peeking out behind it: features, integrations, building blocks. */
export function TileWall({ kicker, title, lead, source, hint, tiles, shape = 'sphere' }: TileWallProps) {
  return (
    <section className="slide">
      <Hint id="tilewall">{hint}</Hint>
      <div className="frame frame--split s-tilewall">
        <div className="tilewall__text">
          <SlideHead kicker={kicker} title={title} lead={lead} />
          <SlideFoot source={source} i={8} />
        </div>
        <div className="tilewall">
          <Shape3D kind={shape} spot={3} size={380} x={78} y={22} rot={-20} />
          <ul className="tilewall__grid">
            {tiles.map((t, i) => (
              <Reveal key={t.label} build i={3 + i * 0.25} className="tilewall__tile">
                <IconTile icon={t.icon} spot={t.spot ?? (((i % 5) + 1) as Spot)} size={88} />
                <span>{t.label}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
