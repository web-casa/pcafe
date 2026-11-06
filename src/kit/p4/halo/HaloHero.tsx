import { Fragment } from 'react'
import { Kicker, Reveal } from '../../../deck/primitives'
import { Hint, SlideFoot } from '../../shared'

export interface HaloHeroProps {
  /** Small uppercase line above the title, ≤ 16 characters. */
  kicker: string
  /** 2–3 lines, each ≤ 10 CJK characters. With 3 lines the last one is drawn faded. */
  lines: string[]
  /** A substring of line 2 set in italic serif. */
  serif?: string
  /** ≤ 40 CJK characters. */
  lead?: string
  /** A shell command shown as a dark pill, ASCII only, ≤ 32 characters. */
  command?: string
  /** A plain link line next to the command, ≤ 40 characters. */
  link?: string
  source?: string
  hint?: string
}

function withSerif(line: string, serif?: string) {
  if (!serif || !line.includes(serif)) return line
  const [a, ...rest] = line.split(serif)
  return (
    <>
      {a}
      <em className="halo__em">{serif}</em>
      {rest.join(serif)}
    </>
  )
}

/** Centered hero: a soft multicolour glow behind 2–3 lines of thin display type, one phrase in italic serif, a striped pill after line 1 and a faded last line. */
export function HaloHero({ kicker, lines, serif, lead, command, link, source, hint }: HaloHeroProps) {
  const ls = lines.slice(0, 3)
  return (
    <section className="slide">
      <Hint id="halohero">{hint}</Hint>
      <div className="frame s-halo">
        <div className="halo__glow" data-crop aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </div>
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <h1 className="halo__title">
          {ls.map((l, i) => (
            <Fragment key={i}>
              <Reveal i={1 + i} className={`halo__line${ls.length === 3 && i === 2 ? ' halo__line--fade' : ''}`}>
                {i === 1 ? withSerif(l, serif) : l}
                {i === 0 && <span className="halo__pill" aria-hidden />}
              </Reveal>
            </Fragment>
          ))}
        </h1>
        {lead && (
          <Reveal i={5}>
            <p className="halo__lead">{lead}</p>
          </Reveal>
        )}
        {(command || link) && (
          <Reveal i={6} className="halo__cta">
            {command && (
              <code className="halo__cmd">
                <span aria-hidden>$</span>
                {command}
              </code>
            )}
            {link && <span className="halo__link">{link}</span>}
          </Reveal>
        )}
        <SlideFoot source={source} i={8} />
      </div>
    </section>
  )
}
