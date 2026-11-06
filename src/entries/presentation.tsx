import { setEmojiStyle } from '../emoji'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { Stage, applyUnit, fitUnit } from '../deck/Stage'
import { Deck } from '../deck/Deck'
import { PresenterView, PrintView } from '../deck/features/presenter'
import { ReadView } from '../deck/features/read'
import { deck as activeDeck } from '../decks/active'
import type { DeckDef } from '../kit'
import '../styles'

// Production entry: the active deck only. It must never import Gallery or the
// template catalog, so a built deck carries no gallery code or copy.
const params = new URLSearchParams(location.search)
const deck: DeckDef = {
  ...activeDeck,
  ...(params.get('style') ? { style: params.get('style') as DeckDef['style'] } : {}),
  ...(params.get('theme') ? { theme: params.get('theme') as DeckDef['theme'] } : {}),
}

applyUnit(fitUnit())

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => {})
  }
})

const special = () => (location.hash.startsWith('#/presenter') ? 'presenter' : location.hash.startsWith('#/print') ? 'print' : location.hash.startsWith('#/read') ? 'read' : null)

function App() {
  setEmojiStyle(deck.emojiStyle)
  useEffect(() => {
    document.documentElement.dataset.view = 'deck'
    applyUnit(fitUnit())
  }, [])
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
void Promise.all(faces.map((f) => document.fonts.load(f, 'Lumen 中文'))).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </StrictMode>,
  )
})
