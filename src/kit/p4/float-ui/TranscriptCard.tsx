import { Reveal } from '../../../deck/primitives'
import { Icon, type IconName } from '../../Icon'
import { Hint, SlideFoot, SlideHead, type SlideBase } from '../../shared'
import { Wave } from './Wave'

export interface TranscriptLine {
  /** Speaker, ≤ 6 CJK characters. */
  who: string
  /** ≤ 6 characters, e.g. 00:12. */
  time: string
  /** ≤ 34 CJK characters. */
  text: string
}

export interface TranscriptCardProps extends SlideBase {
  /** Card title, ≤ 16 characters; meta ≤ 8 characters (e.g. a duration). */
  file: string
  meta: string
  /** 3–4 lines. */
  lines: TranscriptLine[]
  /** Index of the highlighted line. Default 0. */
  focus?: number
  /** 2–3 floating tags around the card, label ≤ 8 CJK characters. */
  tags: { icon: IconName; label: string }[]
}

/** A transcript card with a waveform header and one highlighted line, with small tags floating at its edges. Quotes from a recording, a walkthrough, who-said-what; mark as 示意 unless real. */
export function TranscriptCard({ kicker, title, lead, source, hint, file, meta, lines, focus = 0, tags }: TranscriptCardProps) {
  return (
    <section className="slide">
      <Hint id="transcriptcard">{hint}</Hint>
      <div className="frame frame--split s-trans">
        <div className="trans__text">
          <SlideHead kicker={kicker} title={title} lead={lead} />
          <SlideFoot source={source} i={8} />
        </div>
        <div className="trans">
          <Reveal i={3} className="trans__card">
            <header>
              <span className="fh__play" aria-hidden>
                <Icon name="user-speak" size={26} variant="bold" />
              </span>
              <b>{file}</b>
              <span className="trans__meta">{meta}</span>
            </header>
            <div className="trans__wave">
              <Wave bars={64} played={(focus + 1) / lines.length} seed={2} />
            </div>
            <ol>
              {lines.map((l, i) => (
                <Reveal key={l.time} build i={4 + i} className={`trans__line${i === focus ? ' is-on' : ''}`}>
                  <span className="trans__who">
                    <b>{l.who}</b>
                    <time>{l.time}</time>
                  </span>
                  <p>{l.text}</p>
                </Reveal>
              ))}
            </ol>
          </Reveal>
          {tags.map((t, i) => (
            <Reveal key={t.label} i={6 + i} className={`trans__tag trans__tag--${i}`}>
              <span className="fu-chip">
                <span className="fu-chip__icon">
                  <Icon name={t.icon} size={26} />
                </span>
                {t.label}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
