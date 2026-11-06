import { createContext, useContext } from 'react'

export interface DeckState {
  index: number
  total: number
  /** Jump to a slide (0-based). It opens fully built. */
  go: (i: number) => void
  hintSlot: HTMLElement | null
  /** Morph keys carried over from the previous slide (see `data-morph`). A template skips its own intro for these. */
  arriving: string[]
}

export const DeckContext = createContext<DeckState>({
  index: 0,
  total: 1,
  go: () => {},
  hintSlot: null,
  arriving: [],
})

export const useDeck = () => useContext(DeckContext)
