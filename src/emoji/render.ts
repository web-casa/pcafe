// Turns emoji in text into images from one bundled set, so they look the same on every machine
// and in every export, in any template, with no template changing.
import type { ReactNode } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import raw from 'virtual:emoji-table'
import './emoji.css'

export type EmojiStyle = 'fluent' | 'flat' | 'noto'

const table = JSON.parse(raw) as Record<EmojiStyle, Record<string, string>>
const chars = Object.keys(table.fluent).sort((a, b) => b.length - a.length)
const finder = chars.length ? new RegExp(`(${chars.map((c) => c.replace(/[#*]/g, '\\$&')).join('|')})`, 'u') : null

const override = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('emoji')
let current: EmojiStyle = 'fluent'
/** Set by each format's entry point from its definition, before rendering. `?emoji=` wins, for previews. */
export function setEmojiStyle(style: EmojiStyle | undefined) {
  current = (override as EmojiStyle | null) ?? style ?? 'fluent'
}
setEmojiStyle(undefined)

const uris = new Map<string, string>()
function uri(char: string) {
  const key = current + char
  let v = uris.get(key)
  if (!v) {
    v = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(table[current][char])}`
    uris.set(key, v)
  }
  return v
}

export const emojiImage = (char: string, className = 'em', key?: number) =>
  jsx('img', { className, src: uri(char), alt: char, draggable: false, decoding: 'sync' }, key)

export const hasEmoji = (char: string) => char in table.fluent

function split(text: string): ReactNode {
  if (!finder || !finder.test(text)) return text
  const parts = text.split(finder)
  return jsxs(Fragment, { children: parts.map((part, i) => (i % 2 ? emojiImage(part, 'em', i) : part)) })
}

/** These hosts take text only: an image inside them would be dropped or invalid. */
const TEXT_ONLY = new Set(['title', 'option', 'textarea', 'style', 'script', 'text', 'tspan', 'desc'])

/** SVG text cannot hold an image, so the system font would draw it. Every QA script fails on console errors. */
function refuseSvgEmoji(children: unknown) {
  const text = [children].flat().filter((c) => typeof c === 'string').join('')
  const found = finder?.exec(text)
  if (found) console.error(`emoji ${found[0]} in a chart label: SVG text cannot use the bundled emoji, remove it from "${text.slice(0, 30)}"`)
}

/** Splits text into what a reader sees as characters, so an animation never pulls an emoji sequence apart. */
export function graphemes(text: string) {
  return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), (s) => s.segment)
}

/** Used by the JSX runtime. Function components pass through: their strings arrive at a host element later. */
export function withEmoji(type: unknown, props: Record<string, unknown>) {
  if (type === 'text' || type === 'tspan') refuseSvgEmoji(props.children)
  if (!finder || typeof type === 'function' || (typeof type === 'string' && TEXT_ONLY.has(type))) return props
  const children = props.children
  if (typeof children === 'string') {
    const next = split(children)
    return next === children ? props : { ...props, children: next }
  }
  if (Array.isArray(children) && children.some((c) => typeof c === 'string' && finder.test(c))) {
    return { ...props, children: children.map((c) => (typeof c === 'string' ? split(c) : c)) }
  }
  return props
}
