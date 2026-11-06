// Poster: the eight days of Apollo 11, 50 × 70 cm. Facts and sources as in src/decks/v2-p2 (NASA, ALSJ).
// The moon and the texture in the letters are vector, drawn here from the theme, so they stay sharp at
// any size. The small disc in the seal is the AI-generated decor image from that deck, and says so.
import { Odometer, SplitFlap, TextArc, TextMask, THEMES } from '../../kit'
import { Bleed, Credit, definePrint, Kicker, Kit, Row, Sources, Stack, Text, Title } from '../../print'
import disc from '../../decks/v2-p2/assets/decor-moon-disc.webp'

const THEME = 'cobalt' as const

/** A small seeded generator, so the texture is the same on every build. */
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/** Crater texture as an SVG file, for the letters. Colours are the theme's neutrals. */
function lunarTexture() {
  const t = THEMES[THEME]
  const r = rng(11)
  const W = 2000
  const H = 900
  let body = `<rect width="${W}" height="${H}" fill="${t.paper.card}"/>`
  for (let i = 0; i < 9; i++) body += `<circle cx="${r() * W}" cy="${r() * H}" r="${120 + r() * 240}" fill="${t.soft}" opacity=".3"/>`
  for (let i = 0; i < 200; i++) {
    const x = r() * W
    const y = r() * H
    const c = 6 + r() ** 3 * 70
    body += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${c.toFixed(1)}" fill="${t.ink}" opacity="${(0.1 + r() * 0.16).toFixed(2)}"/><circle cx="${(x - c * 0.14).toFixed(0)}" cy="${(y - c * 0.14).toFixed(0)}" r="${(c * 0.86).toFixed(1)}" fill="${t.paper.card}" opacity=".62"/>`
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${body}</svg>`)}`
}

/** A huge moon running off the sheet, with the trajectory as thin arcs. Illustration only, not to scale. */
function MoonArt() {
  const r = rng(29)
  const craters = Array.from({ length: 90 }, () => {
    const a = r() * Math.PI * 2
    const d = Math.sqrt(r()) * 560
    return { x: 600 + Math.cos(a) * d, y: 600 + Math.sin(a) * d, c: 6 + r() ** 3 * 62 }
  })
  return (
    <svg viewBox="0 0 1200 1200" width="100%" height="100%" style={{ display: 'block' }}>
      <circle cx="600" cy="600" r="600" fill="var(--panel)" />
      <circle cx="600" cy="600" r="598" fill="none" stroke="var(--accent-soft)" strokeOpacity=".5" strokeWidth="2" />
      {craters.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={c.c} fill="var(--card)" />
          <circle cx={c.x + c.c * 0.12} cy={c.y + c.c * 0.12} r={c.c * 0.84} fill="var(--panel)" />
        </g>
      ))}
    </svg>
  )
}

const NASA = 'NASA, Apollo 11 Mission Overview (nasa.gov)；NASA Apollo Lunar Surface Journal；NASA Science, Moon Facts (science.nasa.gov)。时刻由美东夏令时加 4 小时换算为世界时。6.5 亿为 NASA 引用的估计数字。'

export const print = definePrint({
  title: '阿波罗 11 号的八天',
  format: 'poster',
  preset: 'poster-50x70',
  theme: THEME,
  style: 'editorial',
  tone: 'dark',
  iconStyle: 'line-duotone',
  emojiStyle: 'noto',
  viewing: { distanceM: 3, readM: 1, nearM: 0.6 },
  render: () => (
    <Stack grow gap={7}>
      <Bleed top={-140} right={-130} width={420} height={420}><MoonArt /></Bleed>
      <Row cols={[3, 1.05]} align="start">
        <Stack gap={3}>
          <Kicker>阿波罗 11 号 · 1969 年 7 月</Kicker>
          <Text scale={1.25}>从发射到溅落，<br />四个时刻和三个数字。</Text>
        </Stack>
        <Kit part=".x2-ta__art" label="印章" tier="fine" dw={1920}>
          <TextArc kicker="" title="" ring="MAGNIFICENT DESOLATION · MAGNIFICENT DESOLATION · " center="静海" centerLabel="着陆地点" image={disc} alt="" />
        </Kit>
      </Row>
      <Kit part=".x2-tm__wordbox" label="月球字样" tier="head" pad={-160}>
        <TextMask kicker="" word="MOON" title="" image={lunarTexture()} alt="" />
      </Kit>
      <Title lines={['八天往返，', '人第一次站上月球']} mark={[1]} fit />
      <Kit part=".x2-sf__board" label="任务时刻表" dw={1650}>
        <SplitFlap
          kicker=""
          title=""
          heads={['日期', '时间 UTC', '事件', '状态']}
          rows={[
            { time: '07-16', at: '13:32', label: '土星五号发射', status: '起飞' },
            { time: '07-20', at: '20:17', label: '鹰号着陆静海', status: '着陆' },
            { time: '07-21', at: '02:56', label: '第一步踏上月面', status: '出舱' },
            { time: '07-24', at: '16:50', label: '太平洋溅落', status: '返回' },
          ]}
        />
      </Kit>
      <Kit part=".x2-od__row" label="三个数字" dw={1920}>
        <Odometer
          kicker=""
          title=""
          stats={[
            { value: '384,400', unit: 'km', label: '地月平均距离', note: '地球中心到月球中心' },
            { value: '21.6', unit: '小时', label: '两人在月面停留', note: '21 小时 36 分，含舱内休息' },
            { value: '6.5', unit: '亿人', label: '电视观众（估算）', note: 'NASA 引用的估计数字' },
          ]}
        />
      </Kit>
      <Stack gap={1.5}>
        <Sources>来源：{NASA}</Sources>
        <Credit>月面插图与字中纹理为示意，不是实拍。印章圆中图：AI 生成装饰图。</Credit>
      </Stack>
    </Stack>
  ),
})
