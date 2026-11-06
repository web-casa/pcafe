import { Reveal } from '../deck/primitives'
import { Hint, SlideFoot, SlideHead, vars, type SlideBase } from './shared'

export interface BrandFont {
  /** Family name as it should be written, ≤ 20 characters. */
  name: string
  /** Its job, ≤ 10 CJK characters. */
  role: string
  /** CSS font-family to draw the sample with. Use the deck's own families: 'var(--f-display)', 'var(--f-sans)', 'var(--f-mono)'. */
  family: string
  /** Sample text, ≤ 6 characters. Default 'Aa'. */
  sample?: string
}

export interface BrandKitProps extends SlideBase {
  /** 2–3 typefaces. */
  fonts: BrandFont[]
  /** 2–3 rows of 4–10 swatches. A value is a hex colour or a CSS variable such as 'var(--accent)'. */
  palettes: { name: string; colors: { name: string; value: string }[] }[]
  /** 0–4 tokens: label ≤ 8, value ≤ 12 characters. */
  tokens?: { label: string; value: string }[]
}

/** A design system on one slide: typefaces, colour rows and a few tokens. Colours here are content, not styling. */
export function BrandKit({ kicker, title, lead, source, hint, fonts, palettes, tokens = [] }: BrandKitProps) {
  return (
    <section className="slide">
      <Hint id="brandkit">{hint}</Hint>
      <div className="frame s-brandkit">
        <SlideHead kicker={kicker} title={title} lead={lead} />
        <div className="brandkit">
          <Reveal i={3} className="brandkit__card brandkit__fonts">
            {fonts.map((f) => (
              <div key={f.name} className="brandkit__font">
                <span className="brandkit__sample" style={{ fontFamily: f.family }}>
                  {f.sample ?? 'Aa'}
                </span>
                <b>{f.name}</b>
                <span>{f.role}</span>
              </div>
            ))}
          </Reveal>
          <Reveal i={4} className="brandkit__card brandkit__colors">
            {palettes.map((p, r) => (
              <div key={p.name} className="brandkit__row">
                <span className="brandkit__row-name">{p.name}</span>
                <ul>
                  {p.colors.map((c, i) => (
                    <li key={c.name} style={vars({ '--c': c.value, '--k': r * 10 + i })} title={c.name}>
                      <i />
                      <span>{c.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
          {tokens.length > 0 && (
            <Reveal i={5} className="brandkit__card brandkit__tokens">
              {tokens.map((t) => (
                <div key={t.label}>
                  <span>{t.label}</span>
                  <b>{t.value}</b>
                </div>
              ))}
            </Reveal>
          )}
        </div>
        <SlideFoot source={source} i={9} />
      </div>
    </section>
  )
}
