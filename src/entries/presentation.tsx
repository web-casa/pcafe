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

// Wait briefly for core faces so offline/cached decks never flash fallback glyphs,
// while capping remote CDN waits so cold-cache online playback mounts within ~800ms
// (CDN-offloaded copies rewrite @font-face to font-display: swap).
const FONT_LOAD_TIMEOUT_MS = 800
const CORE_FACES = [
  '500 1em Geist',
  '400 1em "Geist Mono"',
  'italic 400 1em "Instrument Serif"',
  '400 1em "Deck Sans SC"',
  '500 1em "Deck Sans SC"',
] as const

const waitFonts = Promise.allSettled(CORE_FACES.map((f) => document.fonts.load(f, 'Lumen 中文')))
const timeout = new Promise<void>((resolve) => setTimeout(resolve, FONT_LOAD_TIMEOUT_MS))

void Promise.race([waitFonts, timeout]).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </StrictMode>,
  )
})
