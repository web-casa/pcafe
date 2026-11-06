// Components v2 · phase 1 (image layouts). A real talk about coral reefs.
// All pictures are AI-generated decorative illustrations (decor-*) except the
// NOAA Coral Reef Watch screenshot (real, captured 2026-10-30).

import type { DeckDef } from '../../kit'
import { CaseStudy, Closing, CompareSlider, DeviceFrame, FilmStrip, MagazineSpread, PhotoCover, PhotoMosaic, PhotoSplit, PhotoStack, PolaroidWall, Statement } from '../../kit'
import wide from './assets/decor-reef-wide.webp'
import tall from './assets/decor-reef-tall.webp'
import fish from './assets/decor-fish-school.webp'
import turtle from './assets/decor-turtle.webp'
import polyp from './assets/decor-polyp.webp'
import seagrass from './assets/decor-seagrass.webp'
import healthy from './assets/decor-coral-healthy.webp'
import bleached from './assets/decor-coral-bleached.webp'
import night from './assets/decor-reef-night.webp'
import aerial from './assets/decor-reef-aerial.webp'
import crw from './assets/screenshot-coral-reef-watch.webp'

const AI = '插图：AI 生成（示意）'
const img = (src: string, alt: string, credit?: string) => ({ src, alt, credit })

const NOAA_BLEACH = 'NOAA NESDIS，2026（nesdis.noaa.gov）'
const GCRMN = 'GCRMN《世界珊瑚礁状况 2020》，UNEP 2021'

export const deck: DeckDef = {
  title: '珊瑚礁：海里的城市',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'editorial',
  slides: [
    {
      id: 'cover',
      label: '封面',
      tone: 'dark',
      render: () => (
        <PhotoCover
          image={img(wide, '阳光照进浅海珊瑚礁的插图', AI)}
          kicker="海洋科普 · 2026"
          title={['珊瑚礁：', '海里的城市']}
          sub="它占的海底不到百分之一，却养活了四分之一的海洋物种。这几年，它正在发烧。"
          source="NOAA 佛罗里达群岛国家海洋保护区，“Coral Reef Biodiversity”（floridakeys.noaa.gov）"
        />
      ),
    },
    {
      id: 'animal',
      label: '珊瑚是什么',
      build: 'reveal',
      render: () => (
        <PhotoSplit
          image={img(tall, '向水面生长的鹿角珊瑚插图', AI)}
          kicker="先认识它"
          title={['珊瑚不是石头，', '是动物']}
          lead="一块珊瑚由成千上万只水螅体组成。它们分泌碳酸钙骨骼，一代代叠起来，才有了礁。"
          points={[
            { title: '水螅体', body: '每只只有几毫米，有口和一圈触手，夜里伸出来捕食浮游生物。' },
            { title: '共生藻', body: '虫黄藻住在珊瑚组织里，靠光合作用为珊瑚提供大部分养分。' },
            { title: '颜色', body: '珊瑚的颜色主要来自共生藻；藻离开，珊瑚就变白。' },
          ]}
          source="NOAA Ocean Service，“What is coral bleaching?”（oceanservice.noaa.gov）"
        />
      ),
    },
    {
      id: 'residents',
      label: '礁上的居民',
      build: 'reveal',
      render: () => (
        <PhotoMosaic
          kicker="生物多样性"
          title="不到 1% 的海底，约 25% 的物种"
          lead="珊瑚礁覆盖的海底面积不到百分之一，却支撑着约四分之一已知的海洋物种。"
          tiles={[
            { image: img(fish, '珊瑚上方盘旋的小鱼群插图', AI), caption: '鱼群' },
            { image: img(turtle, '掠过礁石的绿海龟插图', AI), caption: '绿海龟' },
            { image: img(polyp, '珊瑚水螅体触手特写插图', AI), caption: '水螅体' },
            { image: img(seagrass, '浅水海草床插图', AI), caption: '邻近的海草床' },
          ]}
          source="NOAA 佛罗里达群岛国家海洋保护区，“Coral Reef Biodiversity”（floridakeys.noaa.gov）"
        />
      ),
    },
    {
      id: 'value',
      label: '它给了我们什么',
      build: 'reveal',
      render: () => (
        <PolaroidWall
          kicker="价值"
          title="每年约 2.7 万亿美元的商品和服务"
          lead="这是 GCRMN 对珊瑚礁每年提供的商品和服务的估值，其中旅游约 360 亿美元。"
          items={[
            { image: img(fish, '鱼群插图', AI), note: '渔获与食物' },
            { image: img(aerial, '泻湖与礁盘的鸟瞰插图', AI), note: '挡住海浪' },
            { image: img(turtle, '海龟插图', AI), note: '潜水与旅游' },
            { image: img(polyp, '水螅体插图', AI), note: '新药的线索' },
          ]}
          source={`${GCRMN}；NOAA Ocean Service（oceanservice.noaa.gov）`}
        />
      ),
    },
    {
      id: 'gbr',
      label: '大堡礁',
      build: 'reveal',
      render: () => (
        <CaseStudy
          image={img(aerial, '泻湖与礁盘的鸟瞰插图', AI)}
          kicker="案例 · 大堡礁"
          title={['世界上最大的', '珊瑚礁系统']}
          tags={['澳大利亚', '世界遗产', '1981 年列入']}
          body="大堡礁位于澳大利亚东北海岸，由约 2500 个独立礁体和 900 多座岛屿组成，1981 年列入世界遗产名录。"
          metrics={[
            { value: '34.8万', label: '平方公里面积' },
            { value: '≈2500', label: '个独立礁体' },
            { value: '900+', label: '座岛屿' },
          ]}
          source="UNESCO 世界遗产中心，Great Barrier Reef（whc.unesco.org/en/list/154）"
        />
      ),
    },
    {
      id: 'bleaching',
      label: '白化是什么',
      build: 'reveal',
      render: () => (
        <MagazineSpread
          image={img(polyp, '珊瑚水螅体触手特写插图', AI)}
          kicker="专题 · 白化"
          title={['珊瑚为什么', '会变白']}
          standfirst="白化不等于死亡，但它是一场饥饿的开始。"
          body={[
            '水温持续偏高时，珊瑚会把住在体内的共生藻排出去。藻带走了颜色，也带走了珊瑚的主要食物来源，只剩下透明组织下面的白色骨骼。',
            '如果水温及时回落，藻可以重新住进来，珊瑚能慢慢恢复；如果高温持续太久，珊瑚会饿死，或者更容易生病。',
          ]}
          pull="白化的珊瑚还活着，只是在挨饿。"
          folio="专题 · 第 6 页"
          source="NOAA Ocean Service（oceanservice.noaa.gov）"
        />
      ),
    },
    {
      id: 'compare',
      label: '白化前后',
      build: 'reveal',
      render: () => (
        <CompareSlider
          kicker="对照"
          title="同一片礁，白化前后"
          before={{ image: img(healthy, '色彩丰富的健康珊瑚插图', AI), label: '健康' }}
          after={{ image: img(bleached, '同一构图下全部变白的珊瑚插图', AI), label: '白化' }}
          start={50}
          stops={[
            { at: 82, note: '健康时：颜色来自体内的共生藻' },
            { at: 18, note: '白化后：藻被排出，露出白色骨骼' },
            { at: 50, note: '两张图为 AI 示意，不是同一地点的照片' },
          ]}
          source="NOAA Ocean Service（oceanservice.noaa.gov）"
        />
      ),
    },
    {
      id: 'events',
      label: '四次全球白化',
      build: 'reveal',
      render: () => (
        <FilmStrip
          kicker="时间线"
          title="四次全球白化，一次比一次大"
          lead="数字是遭遇白化级热应激的珊瑚礁面积占全球礁区的比例。"
          frames={[
            { image: img(healthy, '健康珊瑚插图', AI), label: '约 21% 的礁区', mark: '1998' },
            { image: img(fish, '鱼群插图', AI), label: '约 37% 的礁区', mark: '2010' },
            { image: img(night, '黄昏礁石插图', AI), label: '约 68% 的礁区', mark: '14–17' },
            { image: img(bleached, '白化珊瑚插图', AI), label: '约 84% 的礁区', mark: '23–25' },
          ]}
          source={NOAA_BLEACH}
        />
      ),
    },
    {
      id: 'eighty-four',
      label: '84%',
      render: () => (
        <Statement
          kicker="最近一次"
          text={['2023 到 2025 年，', '84% 的礁区受到热应激']}
          marks={['84%']}
          sub="这是有记录以来规模最大的一次全球珊瑚白化事件。"
          source={NOAA_BLEACH}
        />
      ),
    },
    {
      id: 'watch',
      label: '卫星在看',
      build: 'reveal',
      render: () => (
        <DeviceFrame
          kicker="怎么知道的"
          title="卫星每天测一次海温"
          image={{ src: crw, alt: 'NOAA Coral Reef Watch 5 公里每日产品页面截图', credit: '截图：NOAA Coral Reef Watch，2026-10-30' }}
          points={[
            { title: '5 公里分辨率', body: '全球每日海表温度和热应激产品，数据从 1985 年开始。' },
            { title: '预警等级', body: '按累积热应激分级，从“观察”到最高警报。' },
            { title: '公开免费', body: '各国研究者和保护区管理者都能直接下载。' },
          ]}
          source="coralreefwatch.noaa.gov"
        />
      ),
    },
    {
      id: 'regions',
      label: '各地不一样',
      build: 'reveal',
      render: () => (
        <PhotoStack
          kicker="区域差异"
          title={['十年损失 14%，', '各地差得很远']}
          photos={[
            { image: img(wide, '浅海珊瑚礁插图', AI), title: '全球：-14%', body: '2009–2018 年，全球珊瑚礁上的活珊瑚减少了约 14%。' },
            { image: img(night, '黄昏礁石插图', AI), title: '东热带太平洋：-95%', body: '同期损失最重的区域。' },
            { image: img(tall, '鹿角珊瑚插图', AI), title: '东亚：-5%', body: '同期损失最轻的区域。' },
            { image: img(aerial, '泻湖鸟瞰插图', AI), title: '珊瑚三角区', body: '拥有近 30% 的珊瑚礁，受热较少，部分地方在恢复。' },
          ]}
          source={GCRMN}
        />
      ),
    },
    {
      id: 'next',
      label: '接下来',
      build: 'reveal',
      render: () => (
        <PhotoSplit
          side="right"
          image={img(seagrass, '浅水海草床与沙地光斑插图', AI)}
          kicker="展望"
          title={['事件结束了，', '风险还在']}
          lead="NOAA 判断第四次全球白化大概率已在 2025 年年中结束，但提醒厄尔尼诺可能让大范围白化再次出现。"
          points={[
            { title: '高风险区', body: '2026 年 6 月的四个月展望：北太平洋多地、佛罗里达和加勒比。' },
            { title: '恢复需要时间', body: '水温回落后，白化但未死亡的珊瑚才有机会重新长出共生藻。' },
          ]}
          source={`${NOAA_BLEACH}；NOAA Ocean Service`}
        />
      ),
    },
    {
      id: 'close',
      label: '结语',
      render: () => (
        <Closing
          kicker="记住三件事"
          mark="84"
          statement="珊瑚礁小，但撑起很多生命"
          follow="下次看到海温新闻，想想水下的那座城市。"
          takeaways={[
            '珊瑚是动物，靠体内的共生藻获得大部分养分；藻离开，珊瑚就白化。',
            '2023–2025 年的全球白化影响了约 84% 的礁区，是有记录以来最大的一次。',
            '2009–2018 年全球损失约 14% 的珊瑚，但东亚和珊瑚三角区损失较轻。',
          ]}
          refs={['nesdis.noaa.gov', 'oceanservice.noaa.gov', 'gcrmn.net', 'whc.unesco.org/en/list/154']}
        />
      ),
    },
  ],
}
