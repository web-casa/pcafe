import type { Plugin } from 'vite'

export interface EmojiOptions {
  /** Project root that holds `src/assets/emoji`; defaults to the package directory. */
  root?: string
}

/**
 * The emoji table plugin plus the React JSX transform that points
 * `jsxImportSource` at the deck's `/src/emoji` entry.
 */
export function emoji(options?: EmojiOptions): Plugin[]
