// The deck as a plain document, written into the built file so that anything
// reading the HTML without running it (search engines that do not execute
// scripts, AI crawlers, link previews, reader tools) gets the words, not an
// empty <div id="root">. Runs in Node at build time through Vite's SSR loader
// (see outline-plugin.ts); the browser never loads this module.
//
// Each slide is rendered once, statically, exactly as the read view shows it,
// then reduced to headings, paragraphs, lists and tables. React replaces the
// outline when the deck mounts, so the slides on screen are unchanged.
import { renderToStaticMarkup } from 'react-dom/server'
import { StaticSlide } from '../deck/features/presenter'
import { DEFAULT_STYLE } from '../kit/theme'
import type { DeckDef } from '../deck/Deck'
import { CREDIT_URL, creditOn, creditText } from './attribution'
import { deck as activeDeck } from '../decks/active'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ── markup → outline ──────────────────────────────────────────────────────
/** Elements whose content never reaches the outline. */
const DROP = new Set(['svg', 'style', 'script', 'template', 'noscript', 'button', 'select', 'textarea', 'canvas', 'video', 'audio', 'iframe', 'object'])
const VOID = new Set(['br', 'img', 'link', 'meta', 'input', 'hr', 'source', 'wbr', 'col', 'area', 'embed', 'track'])
/** Kept elements and what they become. Headings shift down: the deck title is the one h1. */
const KEEP: Record<string, string> = {
  h1: 'h2', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h4', h6: 'h4',
  p: 'p', figcaption: 'p', blockquote: 'blockquote',
  ul: 'ul', ol: 'ol', li: 'li', dl: 'dl', dt: 'dt', dd: 'dd',
  table: 'table', thead: 'thead', tbody: 'tbody', tr: 'tr', th: 'th', td: 'td',
  strong: 'strong', b: 'strong', em: 'em', i: 'em', code: 'code',
}
/** Kept elements that hold text directly; loose text outside them is wrapped in a <p>. */
const TEXT_HOLDERS = new Set(['h2', 'h3', 'h4', 'p', 'blockquote', 'li', 'dt', 'dd', 'th', 'td'])
const INLINE = new Set(['strong', 'em', 'code'])
const CJK = '⺀-鿿豈-﫿＀-￯　-〿'
const BR = '\u0001'

/** Reduces one slide's static markup to clean, attribute-free document markup. */
export function reduce(markup: string): string {
  const out: string[] = []
  const stack: { tag: string; as: string | null; skip: boolean }[] = []
  let skipping = 0
  let holders = 0
  let loose = false // an implicit <p> for loose text is open
  const closeLoose = () => {
    if (loose) out.push('</p>')
    loose = false
  }
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>|([^<]+)/g
  for (const m of markup.matchAll(re)) {
    const [, closing, rawTag, attrs = '', selfClose, text] = m
    if (text !== undefined) {
      if (skipping) continue
      const t = text.replace(/\s+/g, ' ')
      if (!t.trim()) {
        if (out.length && !out[out.length - 1].endsWith(' ')) out.push(' ')
        continue
      }
      if (!holders && !loose) {
        out.push('<p>')
        loose = true
      }
      out.push(t)
      continue
    }
    if (!rawTag) continue
    const tag = rawTag.toLowerCase()
    if (closing) {
      const i = stack.map((s) => s.tag).lastIndexOf(tag)
      if (i < 0) continue
      for (const s of stack.splice(i).reverse()) {
        if (s.skip) skipping--
        else if (s.as) {
          if (!INLINE.has(s.as)) closeLoose()
          out.push(`</${s.as}>`)
          if (TEXT_HOLDERS.has(s.as)) holders--
        } else if (!skipping && s.tag !== 'span' && s.tag !== 'a' && s.tag !== 'small' && s.tag !== 'time' && s.tag !== 'sup' && s.tag !== 'sub') closeLoose()
        else if (!skipping) out.push(' ')
      }
      continue
    }
    if (tag === 'br') {
      if (!skipping) out.push(BR)
      continue
    }
    const hidden = /\saria-hidden="true"|\shidden(?:[\s=]|$)/.test(attrs)
    const isVoid = VOID.has(tag) || selfClose === '/'
    if (isVoid) continue
    const skip = skipping > 0 || DROP.has(tag) || hidden
    const as = skip ? null : (KEEP[tag] ?? null)
    stack.push({ tag, as, skip })
    if (skip) {
      skipping++
      continue
    }
    if (as) {
      if (!INLINE.has(as)) closeLoose()
      else if (!holders && !loose) {
        // inline text at block level: it belongs to a paragraph
        out.push('<p>')
        loose = true
      }
      out.push(`<${as}>`)
      if (TEXT_HOLDERS.has(as)) holders++
    } else if (!['span', 'a', 'small', 'time', 'sup', 'sub'].includes(tag)) closeLoose()
    else out.push(' ')
  }
  closeLoose()
  let html = out.join('')
  // a line break inside CJK text is not a space; elsewhere it is
  html = html.replace(new RegExp(`([${CJK}])${BR}([${CJK}])`, 'g'), '$1$2').replace(new RegExp(BR, 'g'), ' ')
  html = html.replace(/\s+/g, ' ').replace(/>\s+/g, '>').replace(/\s+</g, '<')
  // drop what carries no words: empty elements, and loose counters or arrows ("01", "→")
  for (let i = 0; i < 4; i++) html = html.replace(/<(\w+)>\s*<\/\1>/g, '')
  html = html.replace(/<p>[\d\s.·:/→←↑↓+×%-]{0,12}<\/p>/g, '')
  return html
}

// ── the document ──────────────────────────────────────────────────────────
export interface Outline {
  title: string
  lang: string
  description: string
  /** Tags for <head>: description, canonical, link preview, structured data. */
  head: string
  /** The outline itself, to sit inside #root until the deck mounts. */
  body: string
}

const textOf = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const clip = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,，、;；:：]+\S*$/, '') + '…')

export interface SlideText {
  n: number
  id: string
  label: string
  /** The slide's words as document markup: one h2, then h3/h4, p, lists, tables. */
  html: string
}

/** Every slide's words, in order. Also used by sites that publish a deck with its full text beside it. */
export function slidesOf(deck: DeckDef): SlideText[] {
  const style = deck.style ?? DEFAULT_STYLE
  const total = deck.slides.length
  return deck.slides.map((slide, i) => {
    let html = ''
    try {
      html = reduce(renderToStaticMarkup(<StaticSlide slide={slide} style={style} u={1} index={i} total={total} />))
    } catch {
      html = '' // a template that cannot render outside the browser keeps just its label
    }
    if (!/<h2>/.test(html)) html = `<h2>${esc(slide.label)}</h2>${html}`
    return { n: i + 1, id: slide.id, label: slide.label, html }
  })
}

export function outlineOf(deck: DeckDef): Outline {
  const lang = deck.lang ?? 'zh-CN'
  const sections = slidesOf(deck).map((s) => `<section id="outline-${s.n}">${s.html}</section>`)
  // the first real paragraph: one that follows a heading, not a kicker above it
  const firstPara = sections.map((s) => s.match(/<\/h2>\s*<p>([\s\S]*?)<\/p>/)?.[1]).find((p) => p && textOf(p).length > 20)
  const description = clip((deck.description ?? (firstPara ? textOf(firstPara) : deck.title)).trim(), 160)
  const author = typeof deck.author === 'string' ? { name: deck.author } : deck.author
  const credit = creditOn(deck.attribution) ? `<p><a href="${CREDIT_URL}">${esc(creditText(lang))}</a></p>` : ''
  const body =
    `<article class="pcafe-outline" lang="${esc(lang)}">` +
    `<header><h1>${esc(deck.title)}</h1><p>${esc(description)}</p>${author ? `<p>${esc(author.name)}</p>` : ''}</header>` +
    sections.join('') +
    `<footer>${deck.url ? `<p><a href="${esc(deck.url)}">${esc(deck.url)}</a></p>` : ''}${credit}</footer>` +
    `</article>`

  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'PresentationDigitalDocument',
    name: deck.title,
    description,
    inLanguage: lang,
    encodingFormat: 'text/html',
    isAccessibleForFree: true,
  }
  if (deck.url) ld.url = deck.url
  if (deck.image) ld.image = deck.image
  if (author) ld.author = { '@type': author.type ?? 'Person', name: author.name, ...(author.url ? { url: author.url } : {}) }
  const json = JSON.stringify(ld).replace(/</g, '\\u003c')
  const head = [
    `<meta name="description" content="${esc(description)}" />`,
    deck.url && `<link rel="canonical" href="${esc(deck.url)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${esc(deck.title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    deck.url && `<meta property="og:url" content="${esc(deck.url)}" />`,
    deck.image && `<meta property="og:image" content="${esc(deck.image)}" />`,
    `<meta name="twitter:card" content="${deck.image ? 'summary_large_image' : 'summary'}" />`,
    `<script type="application/ld+json">${json}</script>`,
    // Kept out of sight while the deck loads; shown as a readable page when scripts never run.
    `<style>#root>.pcafe-outline{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}</style>`,
    `<noscript><style>#root>.pcafe-outline{position:static;width:auto;height:auto;overflow:visible;clip-path:none;white-space:normal;max-width:46rem;margin:0 auto;padding:3rem 1.5rem;font:17px/1.7 system-ui,sans-serif;color:#1d1d1f}#root>.pcafe-outline section{margin-top:2.5rem}</style></noscript>`,
  ]
    .filter(Boolean)
    .join('\n    ')
  return { title: deck.title, lang, description, head, body }
}

/** The active deck's outline (src/decks/active.ts, as `pcafe build` selects it). */
export const activeOutline = (): Outline => outlineOf(activeDeck)
