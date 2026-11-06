import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { creditOn, creditText } from '../engine/attribution'
import { PrintContext, usePrint } from './context'
import { pageBox, type Geometry, type PageGeom, type PageMode } from './geometry'
import { TRIFOLD_A4 } from './presets'
import type { LongDef, PrintDef, PrintTone, TrifoldDef, TrifoldPanel } from './types'

const mm = (n: number) => `${n}mm`

/** Crop marks, fold marks, and a line naming the job. All of it lives outside the bleed. */
function Marks({ g, page, title }: { g: Geometry; page: PageGeom; title: string }) {
  const off = g.bleed + g.slug
  const W = g.trimW + 2 * off
  const H = g.trimH + 2 * off
  const near = g.bleed + g.markGap // where a mark starts, measured out from the trim
  const far = near + g.markLen
  const lines: [number, number, number, number][] = []
  for (const x of [off, off + g.trimW]) {
    lines.push([x, off - near, x, off - far], [x, off + g.trimH + near, x, off + g.trimH + far])
  }
  for (const y of [off, off + g.trimH]) {
    lines.push([off - near, y, off - far, y], [off + g.trimW + near, y, off + g.trimW + far, y])
  }
  const dashed: [number, number, number, number][] = page.folds.flatMap((f) => [
    [off + f, off - near, off + f, off - far],
    [off + f, off + g.trimH + near, off + f, off + g.trimH + far],
  ] as [number, number, number, number][])
  if (g.hiddenBottom) {
    const y = off + g.trimH - g.hiddenBottom
    dashed.push([off - near, y, off - far, y], [off + g.trimW + near, y, off + g.trimW + far, y])
  }
  if (g.topBar) {
    const y = off + g.topBar
    dashed.push([off - near, y, off - far, y], [off + g.trimW + near, y, off + g.trimW + far, y])
  }
  const job = [
    title,
    `${g.label}`,
    `成品 ${g.trimW} × ${g.trimH} mm`,
    `出血 ${g.bleed} mm`,
    g.hiddenBottom ? `可见 ${g.trimW} × ${g.visibleH} mm，顶部 ${g.topBar} mm 进顶杆，底部 ${g.hiddenBottom} mm 进卷轴` : '',
    page.folds.length ? `${page.label}，折线 ${page.folds.join(' / ')} mm` : '',
    'RGB PDF，请印厂转 CMYK',
  ].filter(Boolean).join(' · ')
  return (
    <div className="pr-marks" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} width={mm(W)} height={mm(H)}>
        {lines.map(([a, b, c, d], i) => <line key={i} className="pr-crop" x1={a} y1={b} x2={c} y2={d} />)}
        {dashed.map(([a, b, c, d], i) => <line key={i} className="pr-fold" x1={a} y1={b} x2={c} y2={d} />)}
      </svg>
      <p className="pr-job" style={{ left: mm(off + g.markLen), right: mm(off + g.markLen), top: mm(off - g.bleed - g.slug + 1) }}>{job}</p>
    </div>
  )
}

/** Not printed. Drawn when the page is opened with ?guides=1, and in the QA's guide images. */
function Guides({ g, page, longH }: { g: Geometry; page: PageGeom; longH?: number }) {
  const { inset } = g
  return (
    <div className="pr-guides" aria-hidden style={{ height: longH ? mm(longH) : undefined }}>
      <i className="pr-g-safe" style={{ top: mm(inset.top), right: mm(inset.right), bottom: mm(inset.bottom), left: mm(inset.left) }} />
      {page.folds.map((f) => <i key={f} className="pr-g-fold" style={{ left: mm(f) }} />)}
      {g.topBar > 0 && <i className="pr-g-hide" style={{ top: 0, left: 0, right: 0, height: mm(g.topBar) }}><em>进顶杆</em></i>}
      {g.hiddenBottom > 0 && <i className="pr-g-hide" style={{ bottom: 0, left: 0, right: 0, height: mm(g.hiddenBottom) }}><em>进卷轴，看不见</em></i>}
    </div>
  )
}

function Trim({ g, tone, children, guides, page, longH }: { g: Geometry; tone: PrintTone; children: ReactNode; guides: boolean; page: PageGeom; longH?: number }) {
  return (
    <div className="pr-trim" data-tone={tone}>
      <i className="pr-ground" />
      {children}
      {guides && <Guides g={g} page={page} longH={longH} />}
    </div>
  )
}

function Page({ g, page, mode, title, longH, children }: { g: Geometry; page: PageGeom; mode: PageMode; title: string; longH?: number; children: ReactElement }) {
  const box = pageBox(g, mode, longH)
  return (
    <section className="pr-page" data-side={page.id} style={{ width: mm(box.w), height: g.format === 'long' ? 'auto' : mm(box.h) } as CSSProperties}>
      <div className="pr-box" style={{ left: mm(box.x), top: mm(box.y), width: mm(g.trimW), height: g.format === 'long' ? 'auto' : mm(g.trimH) }}>{children}</div>
      {mode === 'print' && <Marks g={g} page={page} title={title} />}
    </section>
  )
}

function Sample({ text }: { text?: string }) {
  return text ? <p className="pr-sample" data-sample data-tier="read">{text}</p> : null
}

function Live({ g, children }: { g: Geometry; children: ReactNode }) {
  const i = g.inset
  return <div className="pr-live" style={{ padding: `${mm(i.top)} ${mm(i.right)} ${mm(i.bottom)} ${mm(i.left)}` }}>{children}</div>
}

function PanelView({ panel, left, width, trimH, bleed, edge, clear, safe, name, def, side, sample }: { panel: TrifoldPanel; left: number; width: number; trimH: number; bleed: number; edge: 'l' | 'r' | 'm'; clear: number; safe: number; name: string; def: TrifoldDef; side: 'outside' | 'inside'; sample?: string }) {
  const ctx = usePrint()
  const tone = panel.tone ?? def.tone ?? 'light'
  return (
    <PrintContext.Provider value={{ ...ctx, tone }}>
      <div className="pr-panel" data-tone={tone} data-panel={name} style={{ left: mm(left), width: mm(width), height: mm(trimH) }}>
        <i className="pr-panelground" data-fill={panel.fill} style={{ left: edge === 'l' ? mm(-bleed) : 0, right: edge === 'r' ? mm(-bleed) : 0, top: mm(-bleed), bottom: mm(-bleed) }} />
        <div className="pr-panelin" data-side={side} style={{ paddingLeft: mm(edge === 'l' ? safe : clear), paddingRight: mm(edge === 'r' ? safe : clear), paddingTop: mm(safe), paddingBottom: mm(safe) }}>
          <Sample text={sample} />
          {panel.render()}
          {name === 'back' && creditOn(def.attribution) && <p className="pr-source pr-imprint" data-pcafe-credit="" data-tier="fine">{`${creditText(def.lang ?? 'zh')} · p.cafe`}</p>}
        </div>
      </div>
    </PrintContext.Provider>
  )
}

function Trifold({ def, g, mode, guides }: { def: TrifoldDef; g: Geometry; mode: PageMode; guides: boolean }) {
  const o = TRIFOLD_A4.outside
  const i = TRIFOLD_A4.inside
  const common = { trimH: g.trimH, bleed: g.bleed, clear: TRIFOLD_A4.foldClearMm, safe: g.safe, def }
  return (
    <>
      <Page g={g} page={g.pages[0]} mode={mode} title={def.title}>
        <Trim g={g} tone={def.tone ?? 'light'} guides={guides} page={g.pages[0]}>
          <PanelView {...common} side="outside" name="flap" panel={def.outside.flap} left={0} width={o.flap} edge="l" />
          <PanelView {...common} side="outside" name="back" panel={def.outside.back} left={o.flap} width={o.back} edge="m" />
          <PanelView {...common} side="outside" name="cover" panel={def.outside.cover} left={o.flap + o.back} width={o.cover} edge="r" sample={def.sample} />
        </Trim>
      </Page>
      <Page g={g} page={g.pages[1]} mode={mode} title={def.title}>
        <Trim g={g} tone={def.tone ?? 'light'} guides={guides} page={g.pages[1]}>
          <PanelView {...common} side="inside" name="left" panel={def.inside.left} left={0} width={i.left} edge="l" sample={def.sample} />
          <PanelView {...common} side="inside" name="middle" panel={def.inside.middle} left={i.left} width={i.middle} edge="m" />
          <PanelView {...common} side="inside" name="right" panel={def.inside.right} left={i.left + i.middle} width={i.right} edge="r" />
        </Trim>
      </Page>
    </>
  )
}

function Long({ def, g, guides }: { def: LongDef; g: Geometry; guides: boolean }) {
  const ctx = usePrint()
  return (
    <section className="pr-page pr-long" data-side="long" style={{ width: mm(g.trimW) }}>
      {def.sections.map((s) => {
        const tone = s.tone ?? def.tone ?? 'light'
        return (
          <PrintContext.Provider key={s.id} value={{ ...ctx, tone }}>
            <article className="pr-sec" data-sec={s.id} data-tone={tone}>
              <div className="pr-secin">
                <Sample text={def.sample} />
                {s.render()}
                {s.source && <p className="pr-source pr-source--sec" data-source data-tier="fine">来源：{s.source}</p>}
              </div>
            </article>
          </PrintContext.Provider>
        )
      })}
      {guides && <div className="pr-slicelines" />}
    </section>
  )
}

/** The whole item, in the box chosen by `mode`. */
export function Sheet({ def, g, mode, guides }: { def: PrintDef; g: Geometry; mode: PageMode; guides: boolean }) {
  const tone = def.tone ?? 'light'
  const line = creditOn(def.attribution) ? `${creditText(def.lang ?? 'zh')} · p.cafe` : ''
  // A trifold prints it once, on the back panel; everything else after its sources.
  const value = { format: def.format, style: def.style ?? 'standard', tone, credit: def.format === 'trifold' ? '' : line }
  return (
    <PrintContext.Provider value={value}>
      {def.format === 'trifold' ? <Trifold def={def} g={g} mode={mode} guides={guides} />
        : def.format === 'long' ? <Long def={def} g={g} guides={guides} />
        : (
          <Page g={g} page={g.pages[0]} mode={mode} title={def.title}>
            <Trim g={g} tone={tone} guides={guides} page={g.pages[0]}>
              <Live g={g}><Sample text={def.sample} />{def.render()}</Live>
            </Trim>
          </Page>
        )}
    </PrintContext.Provider>
  )
}
