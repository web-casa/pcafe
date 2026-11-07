import { EmojiWall } from './EmojiWall'
import { STYLE_EN, THEME_EN } from '../kit/styles.en'
import { GROUP_TITLES_EN, ICON_GROUPS_EN, LangContext, UI, hasEnglishCatalog, initialLang, localize, saveLang, useLang, useT, type Lang } from './i18n'
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useInView } from 'motion/react'
import { UnitScope, DESIGN_W } from '../deck/Stage'
import { EASE_OUT, pad2 } from '../deck/motion'
import { TemplateRegistry, type RegisteredTemplate } from '../engine/registry'
import { proCatalog, proDecks } from 'virtual:pcafe-pro'
import { DEFAULT_ICON_STYLE, ICON_STYLES, ICON_STYLE_LABELS, Icon, IconStyleProvider, type IconStyle } from '../kit/Icon'
import { ICON_GROUPS, type IconName } from '../kit/icon-set'
import type { DeckDef } from '../deck/Deck'
import { STYLES, THEMES, themeVars, toneOf, type DeckStyle, type ThemeName } from '../kit/theme'
import { deck as release } from '../decks/release'
import { deck as geo } from '../decks/geo'
import { deck as gtm } from '../decks/gtm'
import { deck as launch } from '../decks/launch'
import { deck as studio } from '../decks/studio'
import { deck as mono } from '../decks/mono'
import { deck as sticker } from '../decks/sticker'
import { deck as toy3d } from '../decks/toy3d'
import { deck as wallpaper } from '../decks/wallpaper'
import { deck as p4_keynote } from '../decks/keynote'
import { deck as p4_gradient } from '../decks/gradient'
import { deck as p4_pop } from '../decks/pop'
import { deck as p4_bento } from '../decks/bento'
import { deck as p4_soft_saas } from '../decks/soft-saas'
import { deck as p4_float_ui } from '../decks/float-ui'
import { deck as p4_desktop } from '../decks/desktop'
import { deck as p4_warm_dark } from '../decks/warm-dark'
import { deck as p4_ribbon } from '../decks/ribbon'
import { deck as p4_playful } from '../decks/playful'
import { deck as home_nuance } from '../decks/home-nuance'
import { deck as home_northbound } from '../decks/home-northbound'
import { deck as home_nutshell } from '../decks/home-nutshell'
import { deck as home_cobalt } from '../decks/home-cobalt'
import { deck as v2_p4 } from '../decks/v2-p4'
import { deck as v2_p5 } from '../decks/v2-p5'
import { deck as v2_p1 } from '../decks/v2-p1'
import { deck as v2_p3 } from '../decks/v2-p3'
import { deck as v2_p2 } from '../decks/v2-p2'
import { deck as v3_p5 } from '../decks/v3-p5'
import { deck as v3_p4 } from '../decks/v3-p4'
import { deck as active } from '../decks/active'
import { deck as v3_p3 } from '../decks/v3-p3'
import { deck as v3_p2 } from '../decks/v3-p2'
import { deck as v3_p1 } from '../decks/v3-p1'
import { deck as motionDeck } from '../decks/motion'
import { deck as mockui } from '../decks/mockui'
import { deck as sigBiennale } from '../decks/sig-biennale'
import { deck as sigStencil } from '../decks/sig-stencil'
import { deck as sigNeo } from '../decks/sig-neo'
import { deck as sigBlockFrame } from '../decks/sig-block-frame'
import { deck as sigCobaltGrid } from '../decks/sig-cobalt-grid'
import { deck as sigForest } from '../decks/sig-forest'
import { deck as sigEmerald } from '../decks/sig-emerald'
import { deck as sigPlatform } from '../decks/sig-platform'
import { deck as sigPinkScript } from '../decks/sig-pink-script'
import { deck as sigBroadside } from '../decks/sig-broadside'
import { deck as sigAtelier } from '../decks/sig-atelier'
import { deck as sigMonograph } from '../decks/sig-monograph'
import { deck as sigNocturne } from '../decks/sig-nocturne'
import { deck as sigSunrise } from '../decks/sig-sunrise'

// Free decks plus any Pro deck exposed by the virtual module.
const registry = new TemplateRegistry(proCatalog)
const catalog = registry.all
const DECKS: Record<string, DeckDef> = { release, geo, gtm, launch, studio, mono, sticker, toy3d, wallpaper, 'keynote': p4_keynote, 'gradient': p4_gradient, 'pop': p4_pop, 'bento': p4_bento, 'soft-saas': p4_soft_saas, 'float-ui': p4_float_ui, 'desktop': p4_desktop, 'warm-dark': p4_warm_dark, 'ribbon': p4_ribbon, 'playful': p4_playful, 'home-nuance': home_nuance, 'home-northbound': home_northbound, 'home-nutshell': home_nutshell, 'home-cobalt': home_cobalt, 'v2-p1': v2_p1, 'v2-p4': v2_p4, 'v2-p5': v2_p5, 'v2-p3': v2_p3, 'v2-p2': v2_p2, 'v3-p5': v3_p5, 'v3-p4': v3_p4, 'v3-p3': v3_p3, 'v3-p1': v3_p1, 'v3-p2': v3_p2, motion: motionDeck, mockui, 'sig-biennale': sigBiennale, 'sig-stencil': sigStencil, 'sig-neo': sigNeo, 'sig-block-frame': sigBlockFrame, 'sig-cobalt-grid': sigCobaltGrid, 'sig-forest': sigForest, 'sig-emerald': sigEmerald, 'sig-platform': sigPlatform, 'sig-pink-script': sigPinkScript, 'sig-broadside': sigBroadside, 'sig-atelier': sigAtelier, 'sig-monograph': sigMonograph, 'sig-nocturne': sigNocturne, 'sig-sunrise': sigSunrise, ...proDecks }
const GROUP_TITLES: Record<string, string> = { release: '版式与技术', geo: '图标、图表与图片', gtm: '业务与运营', launch: '面板与节奏', studio: '工作室', mono: '等宽黑与图表', sticker: '贴纸与图表', toy3d: '几何与结构图', wallpaper: '桌面与结构图', 'keynote': '发布会大字', 'gradient': '流彩渐变', 'pop': '波普撞色', 'bento': '便当格', 'soft-saas': '轻柔 SaaS', 'float-ui': '漂浮界面', 'desktop': '复古桌面', 'warm-dark': '暖色深底', 'ribbon': '彩带', 'playful': '糖果', 'home-nuance': '画板', 'home-northbound': '增长官网', 'home-nutshell': '晕光主页', 'home-cobalt': '电光蓝', 'v2-p1': '图片版式', 'v2-p4': '数据与关系', 'v2-p5': '背景与滤镜', 'v2-p3': '卡片与道具', 'v2-p2': '文字与数字动效', 'v3-p5': '卡片与画廊', 'v3-p4': 'AI 与模型', 'v3-p3': '网络、地图与光效', 'v3-p1': '区块与导航', 'v3-p2': '技术图与代码', motion: '按键动效', mockui: '拟真界面', 'sig-biennale': '双年展专属', 'sig-stencil': '模印专属', 'sig-neo': '荧光格专属', 'sig-block-frame': '粗框专属', 'sig-cobalt-grid': '索引专属', 'sig-forest': '林间专属', 'sig-emerald': '翡翠专属', 'sig-platform': '宣言专属', 'sig-pink-script': '夜粉专属', 'sig-broadside': '号外专属', 'sig-atelier': '设计室专属', 'sig-monograph': '专著专属', 'sig-nocturne': '夜紫专属', 'sig-sunrise': '晨光专属' }
const deckOf = (e: RegisteredTemplate) => DECKS[e.deck]
const slideIndex = (d: DeckDef, id: string) => d.slides.findIndex((s) => s.id === id)
const totalPages = Object.values(DECKS).reduce((n, d) => n + d.slides.length, 0)
const iconCount = ICON_GROUPS.reduce((n, g) => n + Object.keys(g.icons).length, 0)
const THEME_NAMES = Object.keys(THEMES) as ThemeName[]

// null = each preview uses its own deck's DeckDef.theme.
const ThemeOverride = createContext<ThemeName | null>(null)
const PresetOverride = createContext<DeckStyle | null>(null)
const PRESET_NAMES = Object.keys(STYLES) as DeckStyle[]

/**
 * #/kit: every template rendered live at thumbnail scale, with the rules for
 * when to use it. Reads the same catalog that generates docs/components.md.
 */
export function Gallery() {
  const [current, setCurrent] = useState(catalog[0].id)
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = (l: Lang) => {
    saveLang(l)
    setLangState(l)
  }
  const t = UI[lang]
  const groupTitle = (deck: string) => (lang === 'en' ? GROUP_TITLES_EN[deck] : GROUP_TITLES[deck]) ?? `Pro · ${deck}`
  const [iconStyle, setIconStyle] = useState<IconStyle>(DEFAULT_ICON_STYLE)
  const [theme, setTheme] = useState<ThemeName | null>(null)
  const [preset, setPreset] = useState<DeckStyle | null>(null)

  useEffect(() => {
    saveLang(initialLang())
    const target = location.hash.match(/^#\/kit\/([\w-]+)/)?.[1]
    if (target) document.getElementById(target)?.scrollIntoView({ block: 'start' })
    else window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of [...catalog.map((c) => c.id), 'styles', 'icons', 'emoji']) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.title = t.docTitle
  }, [t])

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#/kit/${id}`)
  }

  return (
    <LangContext.Provider value={lang}>
    <IconStyleProvider value={iconStyle}>
      <ThemeOverride.Provider value={theme}>
      <PresetOverride.Provider value={preset}>
        <div className="kit">
          <header className="kit-mast">
            <div className="kit-mast__bar">
              <span className="kit-mast__mark">
                <i aria-hidden />
                PCafe
              </span>
              <div className="kit-mast__right">
              <div className="kit-lang" role="radiogroup" aria-label="Language">
                {(['zh', 'en'] as const).map((l) => (
                  <button key={l} type="button" role="radio" aria-checked={lang === l} className={lang === l ? 'is-on' : undefined} onClick={() => setLang(l)} lang={l === 'zh' ? 'zh-CN' : 'en'}>
                    {l === 'zh' ? '中文' : 'EN'}
                  </button>
                ))}
              </div>
              <a className="kit-btn" href="#/1" aria-label={t.open}>
                <span className="kit-btn__label">{t.open}</span>
                <span className="kit-btn__icon" aria-hidden>
                  →
                </span>
              </a>
              </div>
            </div>
            <motion.div className="kit-mast__copy" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_OUT }}>
              <p className="kit-eyebrow">{t.eyebrow(catalog.length)}</p>
              <h1>
                {t.h1[0]}
                <br />
                {t.h1[1]}
              </h1>
              <p className="kit-mast__lead">
                {t.lead} <code>{t.guide}</code>
                {lang === 'en' && '.'}
                {lang === 'en' && !hasEnglishCatalog && <> {t.zhOnly}</>}
              </p>
            </motion.div>
            <dl className="kit-mast__facts">
              <div>
                <dt>{t.facts.templates}</dt>
                <dd>{catalog.length}</dd>
              </div>
              <div>
                <dt>{t.facts.canvas}</dt>
                <dd>1920 × 1080</dd>
              </div>
              <div>
                <dt>{t.facts.decks}</dt>
                <dd>{t.facts.pages(totalPages)}</dd>
              </div>
              <div>
                <dt>{t.facts.icons}</dt>
                <dd>{iconCount}</dd>
              </div>
            </dl>
            <div className="kit-pickers kit-style--mast">
              <StylePicker value={iconStyle} onChange={setIconStyle} />
              <ThemePicker value={theme} onChange={setTheme} />
              <PresetPicker value={preset} onChange={setPreset} />
            </div>
          </header>

          <div className="kit-body">
            <nav className="kit-nav" aria-label={t.nav}>
              <div className="kit-pickers kit-style--nav">
                <StylePicker value={iconStyle} onChange={setIconStyle} />
                <ThemePicker value={theme} onChange={setTheme} />
                <PresetPicker value={preset} onChange={setPreset} />
              </div>
              <ol>
                {catalog.map((c, i) => (
                  <li key={c.id}>
                    {(c.deck ?? 'release') !== (catalog[i - 1]?.deck ?? (i ? 'release' : '')) && <span className="kit-nav__group">{groupTitle(c.deck)}</span>}
                    <a
                      href={`#/kit/${c.id}`}
                      className={current === c.id ? 'is-current' : undefined}
                      aria-current={current === c.id ? 'true' : undefined}
                      onClick={(e) => {
                        e.preventDefault()
                        jump(c.id)
                      }}
                    >
                      <span className="kit-nav__idx">{pad2(i + 1)}</span>
                      <span className="kit-nav__name">{localize(c, lang).name}</span>
                      <span className="kit-nav__comp">{c.component}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <span className="kit-nav__group">{t.resources}</span>
                  <a
                    href="#/kit/styles"
                    className={current === 'styles' ? 'is-current' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      jump('styles')
                    }}
                  >
                    <span className="kit-nav__idx">{pad2(catalog.length + 1)}</span>
                    <span className="kit-nav__name">{t.wall}</span>
                    <span className="kit-nav__comp">style</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#/kit/icons"
                    className={current === 'icons' ? 'is-current' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      jump('icons')
                    }}
                  >
                    <span className="kit-nav__idx">{pad2(catalog.length + 2)}</span>
                    <span className="kit-nav__name">{t.iconIndex}</span>
                    <span className="kit-nav__comp">Icon</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#/kit/emoji"
                    className={current === 'emoji' ? 'is-current' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      jump('emoji')
                    }}
                  >
                    <span className="kit-nav__idx">{pad2(catalog.length + 3)}</span>
                    <span className="kit-nav__name">{t.emojiIndex}</span>
                    <span className="kit-nav__comp">emoji</span>
                  </a>
                </li>
              </ol>
            </nav>

            <main className="kit-main">
              {catalog.map((c, i) => (
                <EntrySection key={c.id} entry={c} n={i + 1} />
              ))}
              <StyleWall />
              <IconIndex style={iconStyle} />
              <EmojiWall n={pad2(catalog.length + 3)} />
              <footer className="kit-foot">
                <p>{t.footAdd}</p>
                <p>
                  {t.footIcons[0]}
                  <a href="https://github.com/480-Design/Solar-Icon-Set">Solar Icons</a>
                  {t.footIcons[1]}
                  <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
                  {t.footIcons[2]}
                </p>
              </footer>
            </main>
          </div>
        </div>
      </PresetOverride.Provider>
      </ThemeOverride.Provider>
    </IconStyleProvider>
    </LangContext.Provider>
  )
}

// Sample pages for the style wall: one per kind of page that styles change most.
const WALL_SAMPLES: { label: string; deck: DeckDef; slideId: string }[] = [
  { label: '封面', deck: launch, slideId: 'cover' },
  { label: '一句话', deck: launch, slideId: 'promise' },
  { label: '面板卡片', deck: launch, slideId: 'panels' },
  { label: '数据页', deck: gtm, slideId: 'kpi' },
  { label: '章节页', deck: gtm, slideId: 'ch2' },
]

/** The same page rendered once per style preset, side by side. */
function StyleWall() {
  const t = useT()
  const lang = useLang()
  const [k, setK] = useState(0)
  const sample = WALL_SAMPLES[k]
  const page = slideIndex(sample.deck, sample.slideId) + 1
  return (
    <section className="kit-icons kit-wall" id="styles" aria-labelledby="styles-h">
      <div className="kit-entry__head">
        <span className="kit-entry__n">{pad2(catalog.length + 1)}</span>
        <div>
          <h2 id="styles-h">
            {t.wall}
            <code>{'DeckDef.style'}</code>
          </h2>
          <p className="kit-entry__role">{t.wallRole(PRESET_NAMES.length)}</p>
        </div>
      </div>
      <p className="kit-entry__summary">
        {t.wallSummary}
      </p>
      <div className="kit-style kit-wall__pick" role="radiogroup" aria-label={t.wallPick}>
        <div className="kit-style__opts">
          {WALL_SAMPLES.map((w, i) => (
            <button key={w.label} type="button" role="radio" aria-checked={k === i} className={k === i ? 'is-on' : undefined} onClick={() => setK(i)}>
              <span>{t.samples[i]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="kit-wall__grid">
        {PRESET_NAMES.map((name) => (
          <figure key={`${name}-${k}`}>
            <PresetOverride.Provider value={name}>
              <Preview deck={sample.deck} slideId={sample.slideId} label={sample.label} page={page} />
            </PresetOverride.Provider>
            <figcaption>
              <b>{lang === 'zh' ? STYLES[name].label : STYLE_EN[name]?.label}</b> <code>{name}</code>
              <span>{lang === 'zh' ? STYLES[name].note : STYLE_EN[name]?.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/** The six Solar series. Changing it re-renders every preview and the icon index. */
function StylePicker({ value, onChange }: { value: IconStyle; onChange: (s: IconStyle) => void }) {
  const t = useT()
  return (
    <div className="kit-style" role="radiogroup" aria-label={t.iconSeries}>
      <span className="kit-style__label">{t.iconSeries}</span>
      <div className="kit-style__opts">
        {ICON_STYLES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={value === s}
            className={value === s ? 'is-on' : undefined}
            onClick={() => onChange(s)}
            title={ICON_STYLE_LABELS[s]}
          >
            <Icon name="stars" size={18} variant={s} tone={value === s ? 'accent' : 'ink'} />
            <span>{ICON_STYLE_LABELS[s]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** Accent palette for every preview. "随演示" keeps each deck's own DeckDef.theme. */
function ThemePicker({ value, onChange }: { value: ThemeName | null; onChange: (t: ThemeName | null) => void }) {
  const opts: (ThemeName | null)[] = [null, ...THEME_NAMES]
  const t0 = useT()
  const zh = useLang() === 'zh'
  return (
    <div className="kit-style" role="radiogroup" aria-label={t0.accent}>
      <span className="kit-style__label">{t0.accent}</span>
      <div className="kit-style__opts">
        {opts.map((t) => (
          <button key={t ?? 'deck'} type="button" role="radio" aria-checked={value === t} className={value === t ? 'is-on' : undefined} onClick={() => onChange(t)}>
            <i className={`kit-swatch${t ? '' : ' is-auto'}`} style={t ? { background: THEMES[t].accent } : undefined} aria-hidden />
            <span>{t ? `${zh ? THEMES[t].label : THEME_EN[t]} · ${t}` : t0.byDeck}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** Display face for every preview. "随演示" keeps each deck's own DeckDef.style. */
function PresetPicker({ value, onChange }: { value: DeckStyle | null; onChange: (t: DeckStyle | null) => void }) {
  const opts: (DeckStyle | null)[] = [null, ...PRESET_NAMES]
  const t0 = useT()
  const zh = useLang() === 'zh'
  return (
    <div className="kit-style" role="radiogroup" aria-label={t0.style}>
      <span className="kit-style__label">{t0.style}</span>
      <div className="kit-style__opts">
        {opts.map((t) => (
          <button key={t ?? 'deck'} type="button" role="radio" aria-checked={value === t} className={value === t ? 'is-on' : undefined} onClick={() => onChange(t)} title={t ? (zh ? STYLES[t].note : STYLE_EN[t]?.note) : undefined}>
            <span>{t ? `${zh ? STYLES[t].label : STYLE_EN[t]?.label} · ${t}` : t0.byDeck}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** Every curated icon, by group. Click a tile to copy its name. */
function IconIndex({ style }: { style: IconStyle }) {
  const t = useT()
  const zh = useLang() === 'zh'
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (name: string) => {
    void navigator.clipboard?.writeText(name).then(() => {
      setCopied(name)
      window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200)
    })
  }
  return (
    <section className="kit-icons" id="icons" aria-labelledby="icons-h">
      <div className="kit-entry__head">
        <span className="kit-entry__n">{pad2(catalog.length + 2)}</span>
        <div>
          <h2 id="icons-h">
            {t.iconIndex}
            <code>{'<Icon name="…" />'}</code>
          </h2>
          <p className="kit-entry__role">
            {t.iconRole(iconCount, ICON_STYLE_LABELS[style])}
          </p>
        </div>
      </div>
      <p className="kit-entry__summary">
        {t.iconSummary[0]}
        <code>iconStyle</code>
        {t.iconSummary[1]}
        <code>tone="accent"</code>
        {t.iconSummary[2]}
      </p>
      <CodeBlock
        code={`export const deck: DeckDef = {
  title: '…',
  iconStyle: '${style}',
  slides: [ … ],
}

<Icon name="radar" size={48} />                 ${t.iconCode[0]}
<Icon name="radar" size={48} tone="accent" />   ${t.iconCode[1]}
<Icon name="radar" variant="bold" />           ${t.iconCode[2]}`}
      />
      {ICON_GROUPS.map((g) => (
        <div key={g.title} className="kit-icons__group">
          <h3>{zh ? g.title : (ICON_GROUPS_EN[g.title] ?? g.title)}</h3>
          <ul>
            {(Object.keys(g.icons) as IconName[]).map((name) => (
              <li key={name}>
                <button type="button" onClick={() => copy(name)} aria-label={t.copyIcon(name)}>
                  <Icon name={name} size={30} />
                  <span>{copied === name ? t.copied : name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

function EntrySection({ entry: source, n }: { entry: RegisteredTemplate; n: number }) {
  const lang = useLang()
  const t = useT()
  const entry = localize(source, lang)
  const deck = deckOf(entry)
  const at = deck ? slideIndex(deck, entry.demo) : -1
  const linkable = active === deck
  return (
    <section className="kit-entry" id={entry.id} aria-labelledby={`${entry.id}-h`}>
      <div className="kit-entry__head">
        <span className="kit-entry__n">{pad2(n)}</span>
        <div>
          <h2 id={`${entry.id}-h`}>
            {entry.name}
            <code>{`<${entry.component} />`}</code>
          </h2>
          <p className="kit-entry__role">{entry.role}</p>
        </div>
      </div>
      <p className="kit-entry__summary">{entry.summary}</p>

      {deck && <Preview deck={deck} slideId={entry.demo} label={deck.slides[at]?.label ?? ''} page={at + 1} />}

      <div className="kit-entry__tools">
        {entry.interaction && <p className="kit-entry__interaction">{entry.interaction}</p>}
        {linkable && at >= 0 && (
          <a className="kit-link" href={`#/${at + 1}`}>
            {t.openInDeck(at + 1)}
          </a>
        )}
      </div>

      <div className="kit-rules">
        <Rule title={t.good} tone="go" items={entry.useWhen} />
        <Rule title={t.avoid} tone="stop" items={entry.avoidWhen} />
        <Rule title={t.limits} tone="limit" items={entry.limits} />
      </div>

      <details className="kit-props">
        <summary>
          Props <span>{entry.props.length}</span>
        </summary>
        <table>
          <tbody>
            {entry.props.map((p) => (
              <tr key={p.name}>
                <th scope="row">
                  <code>{p.name}</code>
                  {p.required && <span className="kit-req">{t.required}</span>}
                </th>
                <td>
                  <code>{p.type}</code>
                </td>
                <td>{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      {entry.example && <CodeBlock code={entry.example} />}
    </section>
  )
}

function Rule({ title, tone, items }: { title: string; tone: string; items: string[] }) {
  return (
    <div className={`kit-rule is-${tone}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const copy = () => {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    })
  }
  return (
    <div className="kit-code">
      <div className="kit-code__bar">
        <span>{t.example}</span>
        <button type="button" onClick={copy}>
          {copied ? t.copied : t.copy}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}

/**
 * A live slide at thumbnail scale. Mounts on first view so its entrance plays where you can see it,
 * and unmounts again when it is far off screen: 200+ live slides at once exhaust the renderer's memory.
 */
function Preview({ deck, slideId, label, page }: { deck: DeckDef; slideId: string; label: string; page: number }) {
  const override = useContext(ThemeOverride)
  const preset = useContext(PresetOverride)
  const shell = useRef<HTMLDivElement>(null)
  const seen = useInView(shell, { once: true, margin: '0px 0px -15% 0px' })
  const near = useInView(shell, { margin: '300% 0px 300% 0px' })
  const inView = seen && near
  const [u, setU] = useState(0)
  const [run, setRun] = useState(0)
  const slide = deck.slides.find((s) => s.id === slideId)
  const t = useT()

  useLayoutEffect(() => {
    const el = shell.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setU(e.contentRect.width / DESIGN_W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="kit-preview" data-seen={seen ? '' : undefined}>
      <div className="kit-preview__screen" ref={shell}>
        {inView && u > 0 && slide && (
          <UnitScope u={u}>
            {/* Theme on a wrapper, so a dark slide's data-tone on the stage can override it. */}
            <div style={themeVars(override ?? deck.theme, preset ?? deck.style)} data-style={preset ?? deck.style ?? 'standard'} key={run}>
              <div className="stage kit-stage" data-tone={toneOf(slide.tone, preset ?? deck.style)} style={{ '--u': `${u}px` } as CSSProperties}>
                <header className="slide-header" aria-hidden>
                  <div className="slide-header__mark">
                    <span className="slide-header__dot" />
                    <span>{deck.title}</span>
                    <span className="slide-header__sep" />
                    <span className="slide-header__muted">{label}</span>
                  </div>
                  <div className="slide-header__hint" />
                  <div className="slide-header__page">
                    <span>{pad2(page)}</span>
                    <span className="slide-header__muted">/ {pad2(deck.slides.length)}</span>
                  </div>
                </header>
                <div className="slide-frame">{slide.render()}</div>
              </div>
            </div>
          </UnitScope>
        )}
      </div>
      <button type="button" className="kit-replay" onClick={() => setRun((r) => r + 1)} aria-label={t.replayLabel}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" />
        </svg>
        {t.replay}
      </button>
    </div>
  )
}
