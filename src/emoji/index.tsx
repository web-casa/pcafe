import type { CSSProperties } from 'react'
import { emojiImage, hasEmoji, setEmojiStyle, type EmojiStyle } from './render'

export { setEmojiStyle, type EmojiStyle }

/** A big emoji used as a picture, e.g. on a cover. In ordinary text, just type the emoji. */
export function Emoji({ e, size, style, className = '' }: { e: string; size?: number | string; style?: CSSProperties; className?: string }) {
  if (!hasEmoji(e)) return null
  return <span className={className} style={{ display: 'inline-block', fontSize: size, lineHeight: 1, ...style }} aria-hidden>{emojiImage(e, 'em em--big')}</span>
}
