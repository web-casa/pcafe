import { useState } from 'react'
import { Reveal } from '../../../deck/primitives'
import { Hint, Lines, type Text } from '../../shared'
import { Photo, type PhotoImage } from '../../v2/p1/img'

export interface StepTrioProps {
  kicker: string
  /** 1 line, ≤ 12 字. */
  title: Text
  /** ≤ 30 字. */
  lead?: string
  /** Three steps: label ≤ 8 个字符, title ≤ 9 字, body ≤ 24 字. */
  steps: { label: string; title: string; body: string }[]
  /** Step 1 picture: 3 photos stacked like prints, and a counter pill ≤ 12 字. */
  inputs: { images: PhotoImage[]; counter?: string }
  /** Step 2 picker: 4–6 options with a thumbnail and a label ≤ 4 字; `on` marks the picked ones. Tap to toggle. */
  options: { image: PhotoImage; label: string; on?: boolean }[]
  /** Step 3 picture: the result, with a chip ≤ 8 个字符. */
  result: { image: PhotoImage; chip?: string }
  /** Live count chip on the picker, `{n}` is replaced by the number picked, e.g. '已选 {n} 种' (≤ 10 字). */
  picked?: string
  hint?: string
}

/** A three-step flow where each card shows its step: prints being uploaded, a style picker you can tap, and the finished picture. Made for `nocturne`, works in any style. */
export function StepTrio({ kicker, title, lead, steps, inputs, options, result, picked, hint }: StepTrioProps) {
  const [on, setOn] = useState(() => options.map((o) => !!o.on))
  const flip = (i: number) => setOn((v) => v.map((x, k) => (k === i ? !x : x)))
  return (
    <section className="slide">
      <Hint id="steptrio">{hint}</Hint>
      <div className="nc-glow is-top" aria-hidden="true" />
      <div className="frame nc-steps">
        <div className="nc-center">
          <Reveal i={0} className="nc-pill">
            {kicker}
          </Reveal>
          <Reveal i={1}>
            <h2 className="nc-title">
              <Lines text={title} />
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="nc-lead">{lead}</p>
            </Reveal>
          )}
        </div>
        <div className="nc-steps__row">
          {steps.slice(0, 3).map((s, i) => (
            <Reveal key={s.title} i={4 + i} y={40} className="nc-step">
              <div className="nc-step__vis">
                {i === 0 && (
                  <div className="nc-prints">
                    {inputs.images.slice(0, 3).map((im, k) => (
                      <img key={k} src={im.src} alt={im.alt} style={{ ['--k' as string]: k }} />
                    ))}
                    {inputs.counter && <span className="nc-chip is-float">{inputs.counter}</span>}
                  </div>
                )}
                {i === 1 && picked && (
                  <span key={on.filter(Boolean).length} className="nc-chip is-float is-count" aria-live="polite">
                    {picked.replace('{n}', String(on.slice(0, 6).filter(Boolean).length))}
                  </span>
                )}
                {i === 1 && (
                  <div className="nc-pick" role="group" aria-label={s.title}>
                    {options.slice(0, 6).map((o, k) => (
                      <button key={o.label} type="button" aria-pressed={on[k]} className={on[k] ? 'is-on' : ''} onClick={() => flip(k)}>
                        <img src={o.image.src} alt={o.image.alt} />
                        {o.label}
                        <i aria-hidden="true">✓</i>
                      </button>
                    ))}
                  </div>
                )}
                {i === 2 && (
                  <div className="nc-result">
                    <Photo image={result.image} />
                    {result.chip && <span className="nc-chip is-float">{result.chip}</span>}
                  </div>
                )}
              </div>
              <span className="nc-step__k">{s.label}</span>
              <b>{s.title}</b>
              <small>{s.body}</small>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
