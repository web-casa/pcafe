// Studio deck for phase 1, in the `studio-dark` preset. Screenshots in
// assets/ are real captures of this project (#/kit, a GTM slide, the G
// overview) taken on 2026-10-30. Figures come from the project's own files.

import type { DeckDef } from '../../kit'
import { BrandKit, FullBleed, HeroPanel, Laurels, Question, TabbedShot, Thanks } from '../../kit'
import { THEMES } from '../../kit/theme'
import kit from './assets/shot-kit.webp'
import kitEntry from './assets/shot-kit-entry.webp'
import overview from './assets/shot-overview.webp'
import slide from './assets/shot-slide.webp'

const SHOTS = '本项目截图，2026-10-30'

export const deck: DeckDef = {
  title: 'PCafe Studio',
  iconStyle: 'line-duotone',
  theme: 'violet',
  style: 'studio-dark',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <HeroPanel
          tag={{ label: '第 1 期', text: '工作室风格' }}
          title={['做演示，', '像搭积木']}
          lead="67 个固定模板，每个都写明内容上限。挑模板、填内容、跑检查，就是一份演示。"
          pills={['打开 #/kit', 'npm run check']}
          src={kit}
          alt="PCafe 组件库首页截图"
          laurels={[
            { title: '67 个模板', sub: '全部带内容上限' },
            { title: '5 种风格', sub: '一行切换' },
            { title: '0 个外部请求', sub: '断网也能打开' },
          ]}
          source={`src/kit/catalog.ts · src/kit/theme.ts · vite.config.ts；截图为${SHOTS}`}
        />
      ),
    },
    {
      id: 'tabs',
      label: '三种视图',
      render: () => (
        <TabbedShot
          kicker="三种视图"
          title="写、挑、放，各有一个入口"
          lead="组件库用来挑模板和风格，放映页就是成品，按 G 打开全部页面的总览。"
          tabs={[
            { label: '组件库', icon: 'gallery', src: kitEntry, alt: '组件库中 Statement 模板的条目截图' },
            { label: '放映', icon: 'presentation', src: slide, alt: 'GTM 演示封面的放映截图' },
            { label: '总览', icon: 'widget', src: overview, alt: '按 G 打开的全部页面总览截图' },
          ]}
          source={SHOTS}
        />
      ),
    },
    {
      id: 'brand',
      label: '设计规范',
      render: () => (
        <BrandKit
          kicker="设计规范"
          title="字体、颜色、尺寸都在一处"
          lead="模板只读这些变量，不写死颜色；换配色或风格时整套一起换。"
          fonts={[
            { name: 'Plus Jakarta Sans', role: '工作室标题', family: 'var(--f-display)' },
            { name: 'Geist + 思源黑体', role: '正文', family: 'var(--f-sans)', sample: 'Aa 字' },
            { name: 'Geist Mono', role: '代码与出处', family: 'var(--f-mono)', sample: '{}' },
          ]}
          palettes={[
            { name: '主题色 · THEMES', colors: Object.entries(THEMES).map(([k, t]) => ({ name: k, value: t.accent })) },
            {
              name: '点缀色 · --spot-1 … 6',
              colors: [1, 2, 3, 4, 5, 6].map((n) => ({ name: `spot-${n}`, value: `var(--spot-${n})` })),
            },
            {
              name: '中性色 · studio-dark',
              colors: ['canvas', 'card', 'panel', 'line', 'line-strong', 'ink'].map((n) => ({ name: n, value: `var(--${n})` })),
            },
          ]}
          tokens={[
            { label: '画布', value: '1920×1080' },
            { label: '最小字号', value: '16.5u' },
            { label: '圆角系数', value: '1.7×' },
            { label: '单位', value: '1u = 1/1920' },
          ]}
          source="src/kit/theme.ts · src/styles/fonts.css · scripts/qa.mjs"
        />
      ),
    },
    {
      id: 'laurels',
      build: 'reveal',
      label: '三条底线',
      render: () => (
        <Laurels
          kicker="三条底线"
          title="每次构建都守住的三件事"
          lead="这些不是奖项，是检查脚本里写死的规则：任何一条不满足，npm run check 就失败。"
          items={[
            { title: '0 个外部请求', sub: '断网也能打开', note: '构建时发现远程脚本、样式或字体链接就报错。' },
            { title: '16.5u 字号下限', sub: '投影也看得清', note: '逐页逐个元素量字号，小于下限即失败。' },
            { title: '4 种视口', sub: '排版不走样', note: '1920、1366、2560、1440 宽各检查一遍。' },
          ]}
          source="vite.config.ts（forbid-remote-urls）· scripts/qa.mjs"
        />
      ),
    },
    {
      id: 'bleed',
      tone: 'dark',
      label: '总览',
      render: () => (
        <FullBleed
          src={overview}
          alt="GTM 演示 30 页的总览截图"
          focus="top"
          kicker="按 G"
          title={['一眼看完', '整份演示']}
          caption="总览里的缩略图是实时渲染的页面，方向键选择，Enter 打开。"
          source={SHOTS}
        />
      ),
    },
    {
      id: 'question',
      label: '问题',
      render: () => <Question kicker="下一步" question={['你的下一份演示，', '用哪种风格？']} sub="在 #/kit 里切换“风格”，同一页内容会按每种风格重新排一遍。" />,
    },
    {
      id: 'thanks',
      label: '谢谢',
      render: () => (
        <Thanks
          kicker="谢谢"
          title="谢谢"
          prompt="关于模板、风格和检查规则，都可以提问。"
          contacts={[
            { icon: 'gallery', label: '组件库', value: '#/kit' },
            { icon: 'book', label: '写作规则', value: 'docs/README.md' },
            { icon: 'list', label: '模板目录', value: 'docs/components.md' },
          ]}
        />
      ),
    },
  ],
}
