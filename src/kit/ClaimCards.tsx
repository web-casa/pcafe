import { Reveal } from '../deck/primitives'
import { Icon, type IconName } from './Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from './shared'

export type Verdict = 'false' | 'unsupported' | 'disputed' | 'partial' | 'supported'

export const VERDICTS: Record<Verdict, { label: string; icon: IconName }> = {
  false: { label: '错误', icon: 'close' },
  unsupported: { label: '缺乏依据', icon: 'question' },
  disputed: { label: '存在争议', icon: 'danger' },
  partial: { label: '部分有依据', icon: 'filter' },
  supported: { label: '有依据', icon: 'check' },
}

export interface Claim {
  /** The claim as people say it, ≤ 22 CJK characters. Rendered in quotes. */
  claim: string
  verdict: Verdict
  /** The evidence in one or two lines, ≤ 36 CJK characters. */
  note: string
  /** Mono topic chip, ≤ 16 characters, e.g. 'llms.txt'. */
  tag?: string
}

export interface ClaimCardsProps extends SlideBase {
  /** 4 or 6 claims. Wrong claims get struck through after they appear. */
  claims: Claim[]
}

/** Fact-check board: common claims, each with a verdict stamp and the evidence. */
export function ClaimCards({ kicker, title, lead, source, hint, claims }: ClaimCardsProps) {
  const cols = claims.length > 4 ? 3 : 2
  return (
    <section className="slide">
      <Hint id="claims">{hint}</Hint>
      <div className="frame s-claims">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="claims" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {claims.map((c, i) => {
            const v = VERDICTS[c.verdict]
            return (
              <Reveal key={c.claim} build i={i * 0.7 + 3} className={`claim is-${c.verdict}`}>
                <div className="claim__top">
                  {c.tag ? <code>{c.tag}</code> : <span />}
                  <span className="claim__stamp" style={{ animationDelay: `${900 + i * 120}ms` }}>
                    <Icon name={v.icon} size={22} variant="bold" />
                    {v.label}
                  </span>
                </div>
                <p className="claim__text">
                  <span style={{ animationDelay: `${1100 + i * 120}ms` }}>“{c.claim}”</span>
                </p>
                <p className="claim__note">{c.note}</p>
              </Reveal>
            )
          })}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
