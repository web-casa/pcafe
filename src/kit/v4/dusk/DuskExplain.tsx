import { useEffect, useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'
import { Panel, Tag, Widget, lineKind } from './parts'

export interface DuskBlock {
  /** 2–5 code lines, each ≤ 40 个字符. */
  lines: string[]
  /** What it does, in plain words: a title ≤ 12 字 and a note ≤ 50 字. */
  title: string
  note: string
}

export interface DuskExplainProps {
  tag?: { icon?: string; label: string }
  /** One line, ≤ 16 字. */
  title: string
  /** File name over the code, ≤ 24 个字符. */
  file?: string
  /** 2–4 blocks of code, top to bottom. */
  blocks: DuskBlock[]
  /** Advance on its own every N ms until someone clicks. Default 3600; 0 turns it off. */
  autoplay?: number
  source?: string
  hint?: string
}

/** Code explained a block at a time: the code on the left, the lit block's plain-language reading on a gradient panel to the right. Blocks advance on their own until you pick one. */
export function DuskExplain({ tag, title, file, blocks, autoplay = 3600, source, hint }: DuskExplainProps) {
  const list = blocks.slice(0, 4)
  const [on, setOn] = useState(0)
  const [auto, setAuto] = useState(autoplay > 0)
  useEffect(() => {
    if (!auto) return
    const t = window.setTimeout(() => setOn((x) => (x + 1) % list.length), autoplay)
    return () => window.clearTimeout(t)
  }, [auto, on, autoplay, list.length])
  let n = 0
  const b = list[on]
  return (
    <section className="slide du">
      <Hint id="duskexplain">{hint}</Hint>
      <div className="du-head">
        {tag && (
          <Reveal i={0}>
            <Tag icon={tag.icon}>{tag.label}</Tag>
          </Reveal>
        )}
        <Reveal i={0.4}>
          <h2 className="du-h2 is-one">{title}</h2>
        </Reveal>
      </div>
      <Reveal i={0.8} className="du-ex__code">
        <div className="du-code is-tall" data-crop>
          {file && <div className="du-code__file">{file}</div>}
          {list.map((blk, k) => (
            <button
              type="button"
              key={k}
              className={`du-ex__blk${k === on ? ' is-on' : ''}`}
              aria-pressed={k === on}
              onClick={() => {
                setAuto(false)
                setOn(k)
              }}
            >
              {blk.lines.slice(0, 5).map((l) => {
                n += 1
                return (
                  <div key={n} className={lineKind(l)}>
                    <em>{String(n).padStart(2, '0')}</em>
                    <span>{l || ' '}</span>
                  </div>
                )
              })}
            </button>
          ))}
        </div>
      </Reveal>
      <Reveal i={1.1} className="du-ex__panel">
        <Panel>
          <div className="du-ex__steps" aria-hidden="true">
            {list.map((_, k) => (
              <i key={k} className={k === on ? 'is-on' : k < on ? 'is-past' : undefined} />
            ))}
          </div>
          <Widget className="du-ex__wd" key={on}>
            <div className="du-wd__h">
              {String(on + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
            </div>
            <b className="du-ex__t">{b?.title}</b>
            <p className="du-ex__n">{b?.note}</p>
          </Widget>
        </Panel>
      </Reveal>
      <div className="du-foot">
        <SlideFoot source={source} />
      </div>
    </section>
  )
}
