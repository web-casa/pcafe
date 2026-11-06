import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { HeaderHint } from '../deck/Deck'
import { Kicker, Reveal, Source } from '../deck/primitives'

/**
 * Text that may be pre-broken. A string wraps naturally; an array renders one
 * line per item, which is how titles get deliberate, balanced line breaks.
 */
export type Text = string | string[]

export function Lines({ text }: { text: Text }) {
  if (typeof text === 'string') return <>{text}</>
  return (
    <>
      {text.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  )
}

export const plain = (t: Text) => (typeof t === 'string' ? t : t.join(''))

/** CSS custom properties without the `as CSSProperties` noise at call sites. */
export const vars = (v: Record<string, string | number>) => v as CSSProperties

/** Fields every content template accepts. */
export interface SlideBase {
  /** Short section label above the title, 2–8 characters. */
  kicker: string
  title: Text
  /** One or two sentences, at most ~60 CJK characters. */
  lead?: string
  /** Where the facts come from. Required whenever the slide states facts. */
  source?: string
  /** Instruction shown in the header centre slot, e.g. how to interact. */
  hint?: ReactNode
}

/** Kicker + title on the left, lead on the right, bottoms aligned. */
export function SlideHead({ kicker, title, lead, aside }: { kicker: string; title: Text; lead?: string; aside?: ReactNode }) {
  return (
    <div className="s-head">
      <div>
        <Reveal i={0}>
          <Kicker>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1}>
          <h2 className="s-title">
            <Lines text={title} />
          </h2>
        </Reveal>
      </div>
      {(lead || aside) && (
        <Reveal i={2} className="s-head__aside">
          {lead && <p className="s-lead">{lead}</p>}
          {aside}
        </Reveal>
      )}
    </div>
  )
}

export function SlideFoot({ source, i = 8 }: { source?: string; i?: number }) {
  if (!source) return null
  return (
    <Reveal i={i} className="s-foot">
      <Source>{source}</Source>
    </Reveal>
  )
}

export function Hint({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null
  return <HeaderHint hintKey={id}>{children}</HeaderHint>
}
