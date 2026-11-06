import { setEmojiStyle } from '../emoji'
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { Stage, applyUnit, fitUnit } from '../deck/Stage'
import { Deck } from '../deck/Deck'
import { Gallery } from '../gallery/Gallery'
import { PresenterView, PrintView } from '../deck/features/presenter'
import { ReadView } from '../deck/features/read'
import { deck as activeDeck } from '../decks/active'
import type { DeckDef } from '../kit'
import '../styles'

// Dev preview entry: `?deck=<folder>` and `#/kit` both live here.
// Production decks use ./presentation.tsx, which never imports the gallery.

// Size the canvas before the first paint so nothing jumps on load.
applyUnit(fitUnit())

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey && !location.hash.startsWith('#/kit')) {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => {})
  }
})

// Dev only: `?deck=<folder>` previews any deck without touching active.ts.
// Lazy, so a broken deck file only breaks its own preview.
const devDecks = import.meta.env.DEV ? import.meta.glob<{ deck: DeckDef }>('../decks/*/index.tsx') : {}
const deckParam = new URLSearchParams(location.search).get('deck')
let deck = activeDeck
// `&style=` / `&theme=` override the deck's own, for the site's style samples.
const params = new URLSearchParams(location.search)
const loadDeck = deckParam && devDecks[`../decks/${deckParam}/index.tsx`]
  ? devDecks[`../decks/${deckParam}/index.tsx`]().then((m) => {
      deck = { ...m.deck, ...(params.get('style') ? { style: params.get('style') as DeckDef['style'] } : {}), ...(params.get('theme') ? { theme: params.get('theme') as DeckDef['theme'] } : {}) }
    })
  : Promise.resolve()

const isKit = () => location.hash.startsWith('#/kit')
const special = () => (location.hash.startsWith('#/presenter') ? 'presenter' : location.hash.startsWith('#/print') ? 'print' : location.hash.startsWith('#/read') ? 'read' : null)

/** `#/kit` opens the component gallery; any other hash is a slide number. */
function App() {
  setEmojiStyle(deck.emojiStyle)
  const [kit, setKit] = useState(isKit)
  useEffect(() => {
    const onHash = () => setKit(isKit())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.view = kit ? 'kit' : 'deck'
    if (!kit) applyUnit(fitUnit())
  }, [kit])
  if (kit) return <Gallery />
  const mode = special()
  if (mode === 'presenter') return <PresenterView deck={deck} />
  if (mode === 'print') return <PrintView deck={deck} />
  if (mode === 'read') return <ReadView deck={deck} />
  return (
    <Stage>
      <Deck {...deck} />
    </Stage>
  )
}

// Fonts are embedded, so waiting costs a few ms and guarantees the intro
// choreography never runs on fallback glyphs. fonts.ready alone would resolve
// immediately because nothing has been rendered yet.
const faces = ['500 1em Geist', '400 1em "Geist Mono"', 'italic 400 1em "Instrument Serif"', '400 1em "Deck Sans SC"', '500 1em "Deck Sans SC"']
void Promise.all([...faces.map((f) => document.fonts.load(f, 'Lumen 中文')), loadDeck]).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </StrictMode>,
  )
})
