/// <reference types="vite/client" />

// Filled in by vite.pro.ts. Empty lists when @pcafe/pro is not installed.
declare module 'virtual:pcafe-pro' {
  import type { DeckDef } from './deck/Deck'
  import type { ProCatalogEntry } from './engine/registry'

  export const proCatalog: ProCatalogEntry[]
  export const proDecks: Record<string, DeckDef>
}

// Filled in by vite.pro.ts from the project's PCafe Pro licence file (vite.licence.ts).
declare module 'virtual:pcafe-licence' {
  /** A valid, unexpired, PCafe-signed licence was found. */
  export const pro: boolean
  export const licenceId: string | null
  /** Why `pro` is false, for the build log; null when it is true. */
  export const licenceProblem: string | null
}
