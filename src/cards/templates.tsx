// Card templates. All layout is in u (short side / 1080), so one template scales to every
// preset of its shape. CSS is in src/styles/cards.css.
import { Emoji } from '../emoji'
import { Fragment, type ReactNode } from 'react'
import { Icon } from '../kit/Icon'
import { Chart, MotifBars } from './charts'
import { fitLines, useCard } from './context'
import type { CardDef, ChartCard, CompareCard, CoverCard, EndingCard, ImageCard, ListCard, Motif, NumberCard, QuoteCard, StepsCard, TextCard, WideCard } from './types'

const LIMITS = { title: 22, sub: 24 }

/** Marks text QA counts against the content limit. */
const lim = (max: number) => ({ 'data-max': max })

function Title({ text }: { text: string }) {
  return <h2 className="cd-title" {...lim(LIMITS.title)}>{text}</h2>
}

/** Multi-line display type with explicit breaks: `data-headline` is what the feed check measures. */
function Headline({ lines, mark, size }: { lines: string[]; mark?: number[]; size: number }) {
  return (
    <h1 className="cd-head" data-headline style={{ fontSize: `calc(${size} * var(--u))` }}>
      {lines.map((l, i) => <span key={i} className={mark?.includes(i) ? 'is-mark' : undefined}>{l}</span>)}
    </h1>
  )
}

function MotifView({ motif, split }: { motif?: Motif; split?: boolean }) {
  if (!motif) return <div className="cd-spacer" />
  if (motif.kind === 'bars') return <MotifBars values={motif.values} ends={motif.ends} split={split} />
  if (motif.kind === 'emoji') {
    return (
      <div className="cd-motif-emoji" aria-hidden>
        <Emoji e={motif.e} className="cd-motif-emoji__main" />
        {motif.around?.slice(0, 3).map((e, i) => <Emoji key={e} e={e} className={`cd-motif-emoji__s cd-motif-emoji__s--${i}`} />)}
      </div>
    )
  }
  return <div className="cd-motif-icon" aria-hidden><Icon name={motif.icon} size={300} /></div>
}

const compactOr = (preset: { compact?: boolean }, v: number) => (preset.compact ? 1080 : v)

function Cover({ c }: { c: CoverCard }) {
  const { m, preset } = useCard()
  const width = preset.crop ? Math.min(m.headW, m.innerW) : m.innerW
  // Width sets the size, unless the lines would leave the rest of the card no room.
  const tallest = compactOr(preset, (m.unitH - m.inset.top - m.inset.bottom) * (m.shape === 'square' ? 0.5 : 0.54)) / (c.lines.length * 1.06)
  const size = fitLines(c.lines, width, 40, preset.compact ? 800 : Math.min(300, tallest))
  const motif = c.motif?.kind === 'bars' && m.shape === 'tall' ? { ...c.motif, ends: undefined } : c.motif
  return (
    <div className="cd-cover">
      <Headline lines={c.lines} mark={c.mark} size={size} />
      {c.sub && !preset.compact && <p className="cd-sub" {...lim(LIMITS.sub)}>{c.sub}</p>}
      {c.hint && !preset.compact && <span className="cd-hint" {...lim(8)}>{c.hint} <i aria-hidden>→</i></span>}
      {preset.compact ? null : <MotifView motif={motif} />}
    </div>
  )
}

function Wide({ c }: { c: WideCard }) {
  const { m, preset } = useCard()
  const left = c.align === 'left'
  const banner = m.shape === 'banner'
  const width = left ? m.innerW * 0.64 : m.headW
  const size = fitLines(c.lines, width, 40, banner ? 400 : 340)
  const motif = c.motif?.kind === 'bars' ? { ...c.motif, ends: undefined } : c.motif
  return (
    <div className={`cd-wide${left ? ' is-left' : ''}${banner ? ' is-banner' : ''}`}>
      {banner && c.motif ? <MotifView motif={motif} split /> : null}
      <div className="cd-wide__text">
        <Headline lines={c.lines} mark={c.mark} size={size} />
        {c.sub && !preset.compact && <p className="cd-sub" {...lim(20)}>{c.sub}</p>}
      </div>
      {!banner && <MotifView motif={motif} />}
    </div>
  )
}

function NumberView({ c }: { c: NumberCard }) {
  const { m } = useCard()
  const unitEm = c.unit ? 0.34 * ([...c.unit].length * 0.7) + 0.1 : 0
  const size = fitLines([c.value], m.innerW / (1 + unitEm / 2), 120, m.shape === 'square' ? 260 : 340)
  return (
    <div className="cd-number">
      <p className="cd-number__label" {...lim(22)}>{c.label}</p>
      <div className="cd-number__value" data-headline style={{ fontSize: `calc(${size} * var(--u))` }}>
        {c.value}{c.unit && <small>{c.unit}</small>}
      </div>
      {c.note && <p className="cd-sub" {...lim(40)}>{c.note}</p>}
      {c.bars ? <MotifBars values={c.bars.values} ends={c.bars.ends} /> : <div className="cd-spacer" />}
    </div>
  )
}

function ChartView({ c }: { c: ChartCard }) {
  return (
    <div className="cd-split">
      <div className="cd-split__head">
        <Title text={c.title} />
        {c.takeaway && <p className="cd-body" {...lim(40)}>{c.takeaway}</p>}
      </div>
      <div className="cd-split__main"><Chart chart={c.chart} /></div>
    </div>
  )
}

function CompareView({ c }: { c: CompareCard }) {
  const max = Math.max(...c.items.map((i) => i.num ?? 0))
  return (
    <div className="cd-split">
      <div className="cd-split__head"><Title text={c.title} /></div>
      <div className="cd-split__main cd-compare">
        {c.items.map((it) => (
          <div key={it.label} className={`cd-compare__item${it.focus ? ' is-focus' : ''}`}>
            <span className="cd-compare__label" {...lim(12)}>{it.label}</span>
            <b className="cd-compare__value">{it.value}{it.unit && <small>{it.unit}</small>}</b>
            {it.num != null && max > 0 && <span className="cd-compare__track"><i style={{ width: `${Math.max(1.5, (it.num / max) * 100)}%` }} /></span>}
            {it.note && <span className="cd-compare__note" {...lim(22)}>{it.note}</span>}
          </div>
        ))}
        {c.verdict && <p className="cd-verdict" {...lim(36)}>{c.verdict}</p>}
      </div>
    </div>
  )
}

function ListView({ c }: { c: ListCard }) {
  const icons = c.items.every((i) => i.icon)
  return (
    <div className="cd-split">
      <div className="cd-split__head"><Title text={c.title} /></div>
      <ol className="cd-split__main cd-list">
        {c.items.map((it, i) => (
          <li key={it.head}>
            <span className="cd-list__mark" aria-hidden>{icons && it.icon ? <Icon name={it.icon} size={56} tone="accent" /> : i + 1}</span>
            <div><b {...lim(14)}>{it.head}</b>{it.body && <p {...lim(40)}>{it.body}</p>}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function StepsView({ c }: { c: StepsCard }) {
  return (
    <div className="cd-split">
      <div className="cd-split__head"><Title text={c.title} /></div>
      <ol className="cd-split__main cd-steps">
        {c.steps.map((s, i) => (
          <li key={s.head}>
            <span className="cd-steps__n" aria-hidden>{i + 1}</span>
            <div><b {...lim(14)}>{s.head}</b>{s.body && <p {...lim(40)}>{s.body}</p>}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function QuoteView({ c }: { c: QuoteCard }) {
  return (
    <div className="cd-quote">
      <span className="cd-quote__mark" aria-hidden />
      <p className="cd-quote__text" {...lim(44)}>{c.text}</p>
      <span className="cd-quote__by" {...lim(24)}>{c.by}</span>
    </div>
  )
}

function Bold({ text }: { text: string }): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => (part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>))
}

function TextView({ c }: { c: TextCard }) {
  return (
    <div className="cd-split">
      <div className="cd-split__head"><Title text={c.title} /></div>
      <div className="cd-split__main cd-text">
        {c.paras.map((p, i) => <p key={i} {...lim(74)}><Bold text={p} /></p>)}
      </div>
    </div>
  )
}

function ImageView({ c }: { c: ImageCard }) {
  return (
    <div className="cd-split cd-image" data-image-kind={c.image.kind} data-credit={c.image.kind === 'photo' ? c.image.credit : undefined}>
      <div className="cd-split__head">
        <Title text={c.title} />
        {c.caption && <p className="cd-body" {...lim(40)}>{c.caption}</p>}
      </div>
      <div className="cd-split__main cd-image__box"><img src={c.image.src} alt={c.image.alt} /></div>
      {c.image.kind === 'photo' && <p className="cd-credit" data-small>图：Unsplash / {c.image.credit}</p>}
    </div>
  )
}

function EndingView({ c }: { c: EndingCard }) {
  const { m } = useCard()
  const size = fitLines(c.lines, m.innerW, 72, m.shape === 'square' ? 150 : 180)
  return (
    <div className="cd-ending">
      <Headline lines={c.lines} mark={c.mark} size={size} />
      {!!c.takeaways?.length && <ul className="cd-ending__take">{c.takeaways.map((t) => <li key={t} {...lim(24)}>{t}</li>)}</ul>}
      <div className="cd-spacer" />
      <p className="cd-ending__cta" {...lim(22)}>{c.cta}</p>
      {!!c.sources?.length && <ul className="cd-ending__src">{c.sources.map((s) => <li key={s} data-small {...lim(44)}>{s}</li>)}</ul>}
    </div>
  )
}

export function CardBody({ card }: { card: CardDef }) {
  switch (card.t) {
    case 'cover': return <Cover c={card} />
    case 'wide': return <Wide c={card} />
    case 'number': return <NumberView c={card} />
    case 'chart': return <ChartView c={card} />
    case 'compare': return <CompareView c={card} />
    case 'list': return <ListView c={card} />
    case 'steps': return <StepsView c={card} />
    case 'quote': return <QuoteView c={card} />
    case 'text': return <TextView c={card} />
    case 'image': return <ImageView c={card} />
    case 'ending': return <EndingView c={card} />
  }
}

/** Templates designed for each shape. Anything else is a mistake QA reports by name. */
export const SHAPES: Record<CardDef['t'], string[]> = {
  cover: ['tall', 'portrait', 'square'],
  wide: ['landscape', 'wide', 'banner'],
  number: ['tall', 'portrait', 'square', 'landscape', 'wide'],
  chart: ['tall', 'portrait', 'square', 'landscape', 'wide'],
  compare: ['tall', 'portrait', 'square', 'landscape', 'wide'],
  quote: ['tall', 'portrait', 'square', 'landscape', 'wide'],
  list: ['tall', 'portrait', 'square', 'landscape'],
  steps: ['tall', 'portrait', 'square'],
  text: ['tall', 'portrait', 'square'],
  image: ['tall', 'portrait', 'square'],
  ending: ['tall', 'portrait', 'square'],
}
