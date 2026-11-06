// Tri-fold: a short history of paper, on A4. Facts and sources as in src/decks/v2-p3 (Wikipedia, 天工开物, US EPA).
// Outside, cover up: fold-in 97, back 100, cover 100 mm. Inside: left 100, middle 100, fold-in 97 mm.
// Fold the 97 mm panel in first, then the cover over it.
import { ClaimCards, MetricBars, Milestones, Odometer, StepTrack } from '../../kit'
import { Bleed, definePrint, Heading, Kicker, Kit, Row, Rule, Sources, Spring, Stack, Text, Title } from '../../print'

/**
 * ISO 216 drawn to scale and cropped by the panel: each sheet is half the one before it, which is the
 * point of the series. It is vector, so it stays sharp, and it has no text, so there is nothing to keep clear.
 */
function ASeries() {
  const W = 1000
  const H = W * Math.SQRT2
  const rects: { x: number; y: number; w: number; h: number }[] = []
  let box = { x: 0, y: 0, w: W, h: H }
  for (let n = 0; n <= 7; n++) {
    rects.push(box)
    box = n % 2 === 0
      ? { x: box.x, y: box.y + box.h / 2, w: box.w, h: box.h / 2 }
      : { x: box.x + box.w / 2, y: box.y, w: box.w / 2, h: box.h }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMinYMax slice" style={{ display: 'block' }} aria-hidden>
      {rects.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke="var(--ink)" strokeOpacity=".62" strokeWidth="2.4" />)}
    </svg>
  )
}

const WIKI = 'Wikipedia · History of paper（2026 年查阅）'

const SHEETS = [['A0', '841 × 1189'], ['A1', '594 × 841'], ['A2', '420 × 594'], ['A3', '297 × 420'], ['A4', '210 × 297']]

const STOPS = [
  { year: '105', place: '东汉洛阳', text: '蔡伦把改进的造纸法奏报朝廷，这是史书里的关键年份。' },
  { year: '751', place: '撒马尔罕', text: '传说怛罗斯之战的战俘带去了造纸术，学界对此存疑。' },
  { year: '793', place: '巴格达', text: '到 793 年，巴格达已经在造纸；794–795 年有纸坊记录。' },
  { year: '1056', place: '沙蒂瓦', text: '伊比利亚半岛有记录的第一座纸坊；1085 年托莱多也已造纸。' },
  { year: '1490', place: '英格兰', text: '约 1490 年，约翰·泰特在赫特福德附近建起英格兰第一座纸坊。' },
]

export const print = definePrint({
  title: '纸的旅程',
  format: 'trifold',
  preset: 'trifold-a4',
  theme: 'crimson',
  style: 'editorial',
  tone: 'light',
  emojiStyle: 'noto',
  outside: {
    flap: {
      render: () => (
        <Stack grow gap={4}>
          <Kicker>翻开先看</Kicker>
          <Heading scale={1.9}>关于纸，常见的三个说法</Heading>
          <Kit part=".claims" label="三个说法" dw={620} dh={1400}>
            <ClaimCards
              kicker=""
              title=""
              claims={[
                { claim: '纸是蔡伦从零发明的', verdict: 'false', note: '考古发现的纸片早于公元 105 年；105 年是蔡伦改进并奏上造纸法。' },
                { claim: '造纸术因怛罗斯之战西传', verdict: 'disputed', note: '说法出自 11 世纪史家记述，Jonathan Bloom 认为不太可能属实。' },
                { claim: '欧洲最早的纸坊在意大利', verdict: 'false', note: '有记录的第一座在 1056 年的沙蒂瓦；法布里亚诺在 13 世纪。' },
              ]}
            />
          </Kit>
          <Spring />
          <Sources>来源：{WIKI}</Sources>
        </Stack>
      ),
    },
    back: {
      render: () => (
        <Stack grow gap={5}>
          <Kicker>这张纸本身</Kicker>
          <Heading scale={1.9}>一张 A4，折两次</Heading>
          <Kit part=".x2-od__row" label="长宽比" dw={700}>
            <Odometer kicker="" title="" stats={[{ value: '1.414', label: '长宽比', note: '长边约是短边的 1.414 倍' }]} />
          </Kit>
          <Rule />
          <Text>对折后比例不变，所以 A0 一路对折就得到 A1、A2……A4。A0 面积 1 平方米。</Text>
          <Stack gap={1.2}>
            {SHEETS.map(([name, size]) => (
              <Row key={name} cols={[1, 5.4]} gap={2} align="baseline">
                <Kicker>{name}</Kicker>
                <Text>{size} mm</Text>
              </Row>
            ))}
          </Stack>
          <Text>这份折页就是 A4，折成三面，宽 100、100、97 mm。最窄的一面折在最里面，合上时不会顶住折缝。</Text>
          <Spring />
          <Sources>来源：Wikipedia · ISO 216。折页三面的宽度是常见做法，不是标准：印前请按印厂模板核对。</Sources>
        </Stack>
      ),
    },
    cover: {
      tone: 'accent',
      render: () => (
        <Stack grow gap={5}>
          <Bleed left={0} right={-3} bottom={-3} height={103}><ASeries /></Bleed>
          <Kicker>一份关于纸的小折页</Kicker>
          <Title lines={['纸的', '旅程']} fit />
          <Text scale={1.25} strong>从东汉洛阳，到你手里这张 A4。</Text>
        </Stack>
      ),
    },
  },
  inside: {
    left: {
      render: () => (
        <Stack grow gap={5}>
          <Kicker>西传</Kicker>
          <Heading scale={1.9}>纸走过的五站</Heading>
          <Kit part=".miles" label="五站" dw={716} dh={560}>
            <Milestones
              kicker=""
              title=""
              events={STOPS.map((s, i) => ({ date: s.year, title: s.place, focus: i === 0 }))}
            />
          </Kit>
          <Rule />
          {STOPS.map((s) => (
            <Row key={s.year} cols={[1, 5.4]} gap={2} align="baseline">
              <Kicker>{s.year}</Kicker>
              <Text>{s.text}</Text>
            </Row>
          ))}
          <Spring />
          <Sources>来源：{WIKI}</Sources>
        </Stack>
      ),
    },
    middle: {
      fill: 'wash',
      render: () => (
        <Stack grow gap={5}>
          <Kicker>古法</Kicker>
          <Heading scale={1.9}>竹纸的五道工序</Heading>
          <Kit part=".steps__list" label="五道工序" dw={620} dh={1400}>
            <StepTrack
              kicker=""
              title=""
              steps={[
                { title: '斩竹漂塘', body: '嫩竹截段，浸在水塘里沤软。' },
                { title: '煮楻足火', body: '拌石灰长时间蒸煮，把纤维煮散。' },
                { title: '荡料入帘', body: '竹帘入浆一荡，留下一层湿纸。' },
                { title: '覆帘压纸', body: '湿纸覆叠成垛，加压挤水。' },
                { title: '透火焙干', body: '贴上生火的夹墙烘干。' },
              ]}
            />
          </Kit>
          <Spring />
          <Sources>来源：宋应星《天工开物·杀青》，1637 年（工序名称照原书，说明为概述）</Sources>
        </Stack>
      ),
    },
    right: {
      render: () => (
        <Stack grow gap={5}>
          <Kicker>回收 ♻️</Kicker>
          <Heading scale={1.9}>美国的纸，回收了多少</Heading>
          <Kit part=".metrics" label="回收率" dw={620} dh={900}>
            <MetricBars
              kicker=""
              title=""
              shares={false}
              rows={[
                { label: '瓦楞纸箱', value: 96.5, suffix: '%' },
                { label: '纸和纸板总体', value: 68.2, suffix: '%' },
                { label: '报纸', value: 64.8, suffix: '%' },
                { label: '其他纸包装', value: 20.8, suffix: '%' },
              ]}
            />
          </Kit>
          <Text>快递和运输用的纸箱几乎都被回收。瓦楞纸箱以外的纸质容器和包装，回收率最低。</Text>
          <Spring />
          <Sources>来源：US EPA · Paper and Paperboard: Material-Specific Data（2018 年数据）</Sources>
        </Stack>
      ),
    },
  },
})
