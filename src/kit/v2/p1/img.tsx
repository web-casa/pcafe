import type { CSSProperties } from 'react'

/** An imported image: a `decor-` illustration or a real screenshot. */
export interface PhotoImage {
  src: string
  alt: string
  /** Small credit line on or under the image, e.g. “插图：AI 生成（示意）”. ≤ 20 字. */
  credit?: string
  /** CSS object-position for the crop. Default 'center'. */
  focus?: string
}

export function Photo({ image, className, style }: { image: PhotoImage; className?: string; style?: CSSProperties }) {
  return (
    <figure className={`v21-photo ${className ?? ''}`} style={style} data-crop>
      <img src={image.src} alt={image.alt} draggable={false} style={{ objectPosition: image.focus ?? 'center' }} />
      {image.credit && <figcaption className="v21-credit">{image.credit}</figcaption>}
    </figure>
  )
}
