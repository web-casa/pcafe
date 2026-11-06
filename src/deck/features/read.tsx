// `#/read`: the whole deck as one scrolling page, for sending after the talk.
// Slides scale to the window, chapters come from the section-break slides, and each
// slide's speaker notes sit under it. Builds show complete, animations at their end.
import { useEffect, useLayoutEffect, useRef, useState, type ReactElement } from 'react'
import type { DeckDef, SlideDef } from '../Deck'
import { DESIGN_W } from '../Stage'
import { pad2 } from '../motion'
import { ChapterProgress, RibbonSection, SectionBreak } from '../../kit'
import { StaticSlide, useDeckRoot } from './presenter'
import type { DeckStyle } from '../../kit/theme'

const CHAPTER_TYPES: unknown[] = [SectionBreak, RibbonSection, ChapterProgress]

interface Chapter { title: string; first: number }

/** Chapters start at each section-break slide; slides before the first one form an opening group. */
export function chaptersOf(slides: SlideDef[]): Chapter[] {
  const out: Chapter[] = []
  slides.forEach((s, i) => {
    const el = s.render() as ReactElement | null
    if (el && CHAPTER_TYPES.includes(el.type)) out.push({ title: s.label, first: i })
  })
  if (!out.length || out[0].first > 0) out.unshift({ title: '开场', first: 0 })
  return out
}

function ReadSlide({ slide, style, index, total }: { slide: SlideDef; style: DeckStyle; index: number; total: number }) {
  const box = useRef<HTMLDivElement>(null)
  const [u, setU] = useState(0)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(() => setU(el.clientWidth / DESIGN_W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className="rd__shot" ref={box}>
      {u > 0 && <StaticSlide slide={slide} style={style} u={u} index={index} total={total} />}
    </div>
  )
}

export function ReadView({ deck }: { deck: DeckDef }) {
  const style = useDeckRoot(deck, 'read')
  const { slides, title } = deck
  const chapters = chaptersOf(slides)
  const [on, setOn] = useState(0)
  useEffect(() => {
    document.title = title
  }, [title])
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('.rd__slide')]
    const io = new IntersectionObserver((list) => {
      for (const e of list) if (e.isIntersecting) setOn(Number((e.target as HTMLElement).dataset.i))
    }, { rootMargin: '-30% 0px -60% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  const chapterAt = (i: number) => chapters.filter((c) => c.first <= i).length - 1
  return (
    <div className="rd">
      <header className="rd__bar">
        <b>{title}</b>
        <span>共 {slides.length} 页 · {chapters.length} 章</span>
        <a href="#/1" onClick={(e) => { e.preventDefault(); location.hash = '#/1'; location.reload() }}>放映</a>
      </header>
      <nav className="rd__toc" aria-label="章节">
        <ol>
          {chapters.map((c, k) => (
            <li key={c.first} className={chapterAt(on) === k ? 'is-on' : undefined}>
              <a href={`#read-${c.first + 1}`} onClick={(e) => { e.preventDefault(); document.getElementById(`read-${c.first + 1}`)?.scrollIntoView({ behavior: 'smooth' }) }}>
                <em>{pad2(c.first + 1)}</em>
                {c.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <main className="rd__main">
        {slides.map((s, i) => (
          <section key={s.id} id={`read-${i + 1}`} className="rd__slide" data-i={i}>
            {chapters.some((c) => c.first === i && i > 0) && <h2 className="rd__chapter">{s.label}</h2>}
            <ReadSlide slide={s} style={style} index={i} total={slides.length} />
            <p className="rd__meta">
              <span>{pad2(i + 1)}</span>
              {s.label}
            </p>
            {s.notes && <p className="rd__notes">{s.notes}</p>}
          </section>
        ))}
      </main>
    </div>
  )
}
