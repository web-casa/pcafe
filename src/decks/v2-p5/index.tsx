// Components v2 · phase 5 example: a short talk on coral bleaching.
// Shows the five backdrops (DeckDef/SlideDef.backdrop) and the five filter /
// atmosphere templates. All images are decor- (AI-generated), decoration only.

import type { DeckDef } from '../../kit'
import { BigStat, Cover, Halftone, LogoWall, MaskReveal, PhotoClosing, ProgressiveBlur, StatRow, Statement } from '../../kit'
import coral from './assets/decor-coral.webp'
import bleached from './assets/decor-bleached.webp'
import rays from './assets/decor-lightrays.webp'
import waves from './assets/decor-waves.webp'
import dusk from './assets/decor-dusk-sea.webp'

const AI = '图：AI 生成装饰图，非实拍'
const NOAA_ORS = 'NOAA Ocean Service · oceanservice.noaa.gov'
const CRW = 'NOAA Coral Reef Watch · coralreefwatch.noaa.gov'
const NOAA25 = 'NOAA 新闻稿 2025 · noaa.gov'

export const deck: DeckDef = {
  title: '珊瑚为什么变白',
  theme: 'cobalt',
  style: 'editorial',
  backdrop: 'dots',
  slides: [
    {
      id: 'cover',
      label: '封面',
      backdrop: 'mesh',
      render: () => (
        <Cover
          kicker="海洋 · 15 分钟讲清楚"
          title={['珊瑚为什么', '变白']}
          lead="2023 到 2025 年的第四次全球珊瑚白化，是有记录以来范围最大的一次。"
          facts={[
            { label: '受热浪影响的礁区', value: '约 84%' },
            { label: '涉及国家和地区', value: '83 个' },
            { label: '全球白化事件', value: '第 4 次' },
          ]}
          numeral="84%"
          note={['数据：NOAA', '2025 年']}
        />
      ),
    },
    {
      id: 'reef',
      build: 'reveal',
      label: '珊瑚礁',
      tone: 'dark',
      backdrop: 'none',
      render: () => (
        <ProgressiveBlur
          kicker="先认识珊瑚礁"
          title={['不到 1% 的海底，', '养着约四分之一的海洋生物']}
          lead="珊瑚礁覆盖的海底面积不到 1%，却为大约 25% 的海洋物种提供栖身之所。"
          tags={['动物', '共生藻', '礁石']}
          image={coral}
          alt="色彩丰富的珊瑚礁抽象插图"
          credit={AI}
          source={NOAA_ORS}
        />
      ),
    },
    {
      id: 'share',
      label: '珊瑚礁',
      render: () => (
        <BigStat
          kicker="小面积，大作用"
          title="珊瑚的能量，大多来自体内的藻"
          figure="90%"
          caption="珊瑚组织里的共生藻，最多可提供珊瑚所需能量的 90%"
          support={[
            { value: '< 1%', label: '珊瑚礁占海底面积' },
            { value: '约 25%', label: '依赖珊瑚礁的海洋物种' },
          ]}
          source={`${NOAA_ORS}；${CRW}`}
        />
      ),
    },
    {
      id: 'what',
      label: '白化',
      build: 'reveal',
      render: () => (
        <Halftone
          kicker="什么是白化"
          title={['颜色来自藻，', '白色是骨骼']}
          lead="海水过热时，珊瑚会把体内的共生藻排出去。组织变透明，露出白色的碳酸钙骨骼。"
          image={bleached}
          alt="深蓝海水中发白的珊瑚枝，半调网点效果"
          facts={[
            { value: '共生藻', label: '珊瑚颜色的来源' },
            { value: '未必死亡', label: '白化后仍可能恢复' },
          ]}
          credit={AI}
          source={NOAA_ORS}
        />
      ),
    },
    {
      id: 'stages',
      label: '白化',
      build: 'reveal',
      render: () => (
        <MaskReveal
          kicker="三个阶段"
          title={['从受热，', '到恢复或死去']}
          steps={[
            { label: '热应激', text: '海温持续高于当地夏季最高月均温，共生关系开始失衡。' },
            { label: '排出共生藻', text: '珊瑚失去藻类和大部分能量来源，颜色褪去、变白。' },
            { label: '恢复或死亡', text: '海温及时回落，藻类可以回来；高温持续太久，珊瑚会饿死。' },
          ]}
          image={coral}
          alt="珊瑚礁插图，由灰白逐步恢复色彩"
          credit={AI}
          source={NOAA_ORS}
        />
      ),
    },
    {
      id: 'dhw',
      label: '热应激',
      build: 'reveal',
      backdrop: 'grid',
      render: () => (
        <Halftone
          kicker="怎么测热"
          title={['热量是', '一周周攒起来的']}
          lead="“度热周”把过去 12 周里超过夏季最高月均温 1 °C 以上的部分累加起来，单位是 °C-周。"
          image={waves}
          alt="抽象水波纹理，抖动点阵效果"
          mode="dither"
          facts={[
            { value: '12 周', label: '累计的时间窗' },
            { value: '4', label: '°C-周：明显白化' },
            { value: '8', label: '°C-周：严重白化' },
          ]}
          credit={AI}
          source={CRW}
        />
      ),
    },
    {
      id: 'events',
      label: '历史',
      build: 'reveal',
      backdrop: 'particles',
      render: () => (
        <StatRow
          kicker="四次全球白化"
          title="间隔越来越短"
          lead="NOAA 确认的全球性珊瑚白化事件，每次都横跨三大洋。"
          stats={[
            { value: '1998', label: 'EVENT 01', note: '第一次全球白化' },
            { value: '2010', label: 'EVENT 02', note: '第二次' },
            { value: '2014–17', label: 'EVENT 03', note: '约 66% 的礁区受热浪影响' },
            { value: '2023–25', label: 'EVENT 04', note: '约 84%，有记录以来最广' },
          ]}
          source={`${NOAA25}；${CRW}`}
        />
      ),
    },
    {
      id: 'scale',
      label: '规模',
      backdrop: 'paper',
      render: () => (
        <BigStat
          kicker="这一次"
          title="全球大部分珊瑚礁都被热浪扫过"
          figure="84%"
          caption="2023 年 1 月以来，经历白化级热应激的珊瑚礁面积占比"
          support={[
            { value: '83 个', label: '受影响的国家和地区' },
            { value: '约 66%', label: '上一次（2014–2017）的占比' },
          ]}
          source={NOAA25}
        />
      ),
    },
    {
      id: 'note',
      label: '规模',
      backdrop: 'paper',
      render: () => (
        <Statement
          kicker="读数提醒"
          text={['84% 是受热面积，', '不等于 84% 都已白化']}
          marks={['受热面积']}
          sub="热应激达到白化级别，不代表每一片礁都白化或死亡。"
          source={NOAA25}
        />
      ),
    },
    {
      id: 'help',
      label: '应对',
      build: 'reveal',
      render: () => (
        <MaskReveal
          kicker="能做什么"
          title={['给珊瑚', '留出恢复时间']}
          shape="blinds"
          steps={[
            { label: '减少温室气体', text: '海洋变暖是全球白化的主因，根本上要靠减排。' },
            { label: '减轻本地压力', text: '减少污染、径流和过度捕捞，让珊瑚更扛得住热浪。' },
            { label: '持续监测', text: '用卫星海温预警，及早安排调查和保护措施。' },
          ]}
          image={rays}
          alt="阳光从海面射入深蓝海水的插图"
          credit={AI}
          source={NOAA_ORS}
        />
      ),
    },
    {
      id: 'network',
      label: '应对',
      build: 'reveal',
      backdrop: 'dots',
      render: () => (
        <LogoWall
          kicker="谁在监测"
          title="一张多方合作的观测网"
          lead="卫星给出大范围预警，现场调查负责确认。下面是常见的参与方类型。"
          items={[
            { name: '卫星海温', role: '大范围预警' },
            { name: '气象机构', role: '海温预报' },
            { name: '海洋保护区', role: '现场管理' },
            { name: '大学实验室', role: '研究分析' },
            { name: '潜水志愿者', role: '水下记录' },
            { name: '渔业社区', role: '日常观察' },
            { name: '博物馆', role: '公众科普' },
            { name: '地方政府', role: '政策执行' },
          ]}
          note="标识为占位图形，名称为参与方类型，均为示意。"
          source="示意，不对应具体机构"
        />
      ),
    },
    {
      id: 'end',
      build: 'reveal',
      label: '结尾',
      tone: 'dark',
      backdrop: 'none',
      render: () => (
        <PhotoClosing
          kicker="最后"
          title={['白色还不是', '终点']}
          lead="只要海温及时回落，白化的珊瑚仍有机会恢复。时间窗口，就是我们能争取的东西。"
          actions={['查看本地海域的白化预警', '减少一次性塑料与径流污染', '支持珊瑚礁保护区']}
          image={dusk}
          alt="黄昏时平静的海平线插图"
          credit={AI}
          source={NOAA_ORS}
        />
      ),
    },
  ],
}
