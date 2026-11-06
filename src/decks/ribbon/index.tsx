// Ribbon deck for phase 4, in the `ribbon` preset. Facts come from this
// project's own docs and files on 2026-10-30.

import type { DeckDef } from '../../kit'
import { BigStat, IconGrid, RibbonCover, RibbonSection, Statement, StepTrack, Thanks } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 彩带',
  iconStyle: 'bold-duotone',
  theme: 'cobalt',
  style: 'ribbon',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <RibbonCover
          kicker="第 4 期 · 彩带风格"
          title={['做演示，', '先守住规则']}
          lead="用彩带风格走一遍 PCafe 的工作流和交付标准。"
          band="SLIDE"
          band2="PASS"
        />
      ),
    },
    {
      id: 'ch1',
      label: '工作流',
      render: () => (
        <RibbonSection
          kicker="第一章"
          index={1}
          title="按顺序做"
          lead="工作流一共七步，不要跳步。这一章挑出动手最多的四步和文案规则。"
          contents={['四个关键步骤', '六条文案规则']}
        />
      ),
    },
    {
      id: 'steps',
      label: '四步',
      build: 'reveal',
      render: () => (
        <StepTrack
          kicker="工作流"
          title="四步做出一份演示"
          steps={[
            { title: '写故事线', body: '先写下听众要记住的那一句，它就是最后一页的结论。', cmd: 'Closing statement' },
            { title: '选模板', body: '按决策表给每页挑模板，同一个模板最多用两次。', cmd: 'docs/components.md' },
            { title: '建文件', body: '复制一份参考演示，再在 active.ts 里切换过去。', cmd: 'src/decks/<name>/index.tsx' },
            { title: '跑检查', body: '出现 FAIL 就修，最后输出 PASS 才算通过。', cmd: 'npm run check' },
          ]}
          source="docs/README.md 第 1 节"
        />
      ),
    },
    {
      id: 'copy',
      label: '文案',
      build: 'reveal',
      render: () => (
        <IconGrid
          kicker="文案规则"
          title="写文案，先守六条规则"
          items={[
            { icon: 'text', title: '标题是观点', tag: '§5.1', body: '写“birch 已转入 LTS”，不写“支持周期介绍”。' },
            { icon: 'tag', title: '小标签是话题', tag: '§5.2', body: 'kicker 只写 2–8 字的话题，例如“升级前”。' },
            { icon: 'document', title: '导语是证据', tag: '§5.3', body: 'lead 写证据或背景，一到两句，不复述标题。' },
            { icon: 'chart', title: '数字带单位', tag: '§5.4', body: '数字写明单位和口径，估算值要标“估算”。' },
            { icon: 'forbidden', title: '不写空话', tag: '§5.6', body: '去掉“赋能”“无缝”这类词，用具体的名词和数字。' },
            { icon: 'code', title: '命令照原样', tag: '§5.7', body: '命令和文件名放进等宽字段，不放进正文。' },
          ]}
          source="docs/README.md 第 5 节"
        />
      ),
    },
    {
      id: 'ch2',
      label: '交付',
      render: () => (
        <RibbonSection
          kicker="第二章"
          index={2}
          title="检查与交付"
          lead="写完不等于做完。自动检查通过，再逐页看过截图，才能交出去。"
          contents={['四种窗口逐页检查', '放不下就拆页']}
        />
      ),
    },
    {
      id: 'qa',
      label: '检查',
      render: () => (
        <BigStat
          kicker="自动检查"
          title={['每一页，', '检查四遍']}
          figure="4 种"
          caption="npm run qa 逐页检查时用的窗口尺寸"
          support={[
            { value: '17u', label: '画布上允许的最小字号' },
            { value: '1920', label: '画布宽度，按设计单位 u 计' },
            { value: '0', label: '允许引用的远程资源' },
          ]}
          source="docs/README.md 第 6、8 节"
        />
      ),
    },
    {
      id: 'split',
      label: '拆页',
      tone: 'accent',
      render: () => (
        <Statement
          kicker="内容上限"
          text={['放不下就拆页，', '不要缩小字号']}
          marks={['拆页']}
          sub="每个字段都有内容上限，写在 components.md 里。"
          source="AGENTS.md"
        />
      ),
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
            { icon: 'widget', label: '风格', value: '#/kit/styles' },
            { icon: 'stars', label: '图标', value: '#/kit/icons' },
            { icon: 'monitor', label: '开发', value: 'localhost:5173' },
          ]}
        />
      ),
    },
  ],
}
