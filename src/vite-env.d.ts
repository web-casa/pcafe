/// <reference types="vite/client" />

// Filled in by vite.pro.ts. Empty lists when @pcafe/pro is not installed.
declare module 'virtual:pcafe-pro' {
  import type { DeckDef } from './deck/Deck'
  import type { ProCatalogEntry } from './engine/registry'

  export const proCatalog: ProCatalogEntry[]
  export const proDecks: Record<string, DeckDef>
}

// Filled in by vite.pro.ts: true when @pcafe/pro is installed in the project.
declare module 'virtual:pcafe-licence' {
  export const pro: boolean
}
