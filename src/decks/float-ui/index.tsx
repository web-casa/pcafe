// Float UI deck for phase 4, in the `float-ui` preset. Figures come from this
// project's own files on 2026-10-30. The transcript on the `narrate` slide is
// an illustration (示意); the chips and waveforms are decoration.

import type { DeckDef } from '../../kit'
import { BigStat, Closing, FloatHero, NumberedColumns, Statement, Terminal, TranscriptCard } from '../../kit'

export const deck: DeckDef = {
  title: 'PCafe 浮窗',
  iconStyle: 'line-duotone',
  theme: 'violet',
  style: 'float-ui',
  slides: [
    {
      id: 'hero',
      label: '封面',
      render: () => (
        <FloatHero
          kicker="第 4 期 · 浮窗风格"
          title={['讲的时候，', '只管往下讲']}
          lead="全屏、总览、自动播放、逐条展开，都是一个按键的事。"
          chips={[
            { icon: 'monitor', label: '全屏 F' },
            { icon: 'restart', label: '自动播放 P' },
            { icon: 'widget', label: '总览 G' },
            { icon: 'layers', label: '逐条展开' },
            { icon: 'cursor', label: '控制栏' },
            { icon: 'document', label: '单个 HTML' },
          ]}
          card={{ label: 'AUTOPLAY', text: '每 8 秒前进一步' }}
          source="docs/README.md 第 9 节"
          hint="按 → 翻页"
        />
      ),
    },
    {
      id: 'narrate',
      label: '逐条展开',
      build: 'reveal',
      render: () => (
        <TranscriptCard
          kicker="逐条展开"
          title={['讲到哪一条，', '就亮到哪一条']}
          lead="设了 build 的页，每按一次 → 出现一项。右边的讲稿是示意。"
          file="讲稿 · 第 5 页"
          meta="00:24"
          focus={1}
          lines={[
            { who: '讲者', time: '00:00', text: '按 → 进入这一页，页眉右侧的小圆点显示进度。' },
            { who: '讲者', time: '00:08', text: '每按一次出现一项，全部出现后再按才翻页。' },
            { who: '讲者', time: '00:16', text: '按 ← 逐项收回；跳页进来时整页直接展开。' },
          ]}
          tags={[
            { icon: 'keyboard', label: '→ / Space' },
            { icon: 'layers', label: 'build' },
          ]}
          source="docs/README.md 第 9 节；讲稿为示意"
        />
      ),
    },
    {
      id: 'autoplay',
      label: '自动播放',
      render: () => (
        <BigStat
          kicker="自动播放"
          title={['按一下 P，', '演示自己走']}
          figure="8 秒"
          caption="自动播放时每一步停留的时间，逐条展开也算一步"
          support={[
            { value: 'P', label: '开始或暂停自动播放' },
            { value: '2.4 秒', label: '鼠标静止多久后控制栏隐藏' },
          ]}
          source="docs/README.md 第 9 节"
        />
      ),
    },
    {
      id: 'views',
      label: '三种视图',
      build: 'reveal',
      render: () => (
        <NumberedColumns
          kicker="视图"
          title="放映时，有三种看法"
          items={[
            { tag: 'F', title: '全屏', body: '按 F 或点控制栏右侧的按钮进入全屏，画布按比例缩放。', icon: 'monitor' },
            { tag: 'G', title: '总览', body: '按 G 看全部页面，方向键选页，Enter 打开，Esc 返回。', icon: 'widget' },
            { tag: '#/kit', title: '组件库', body: '打开 #/kit 浏览全部模板，还能切换风格查看样张。', icon: 'gallery' },
          ]}
          source="docs/README.md 第 9 节；AGENTS.md"
        />
      ),
    },
    {
      id: 'terminal',
      label: '三条命令',
      render: () => (
        <Terminal
          kicker="命令"
          title="日常只敲这三条"
          window="deck-kit: ~"
          prompt="$"
          steps={[
            { cmd: 'npm run dev', note: '启动开发服务器，在 5173 端口预览。' },
            { cmd: 'npm run check', out: ['# typecheck, build, qa'], note: '依次跑完三步，最后一行是 PASS 才算完成。' },
            { cmd: 'npm run docs', note: '改了 catalog.ts 之后，重新生成组件文档。' },
          ]}
          source="package.json scripts；AGENTS.md"
        />
      ),
    },
    {
      id: 'statement',
      label: '一句话',
      render: () => (
        <Statement
          kicker="离线"
          text={['断网也能放映，', '因为一切都在一个文件里']}
          marks={['一个文件']}
          sub="构建产物 dist/index.html 不引用任何远程资源。"
          source="docs/README.md 第 6、9 节"
        />
      ),
    },
    {
      id: 'close',
      label: '结尾',
      render: () => (
        <Closing
          kicker="最后"
          mark="4"
          statement="卡片在飘，重点不飘"
          follow="在 #/kit 用风格切换器看看浮窗风格"
          takeaways={[
            '漂浮的小卡片只做点缀，写的都是这一页真的讲到的按键和功能',
            '讲稿和声波是示意，不是录音，图注里要写明示意',
            '浮窗风格只改字体、底色、圆角和阴影，内容上限一个都不变',
          ]}
          refs={['docs/README.md', 'docs/components.md', 'AGENTS.md']}
        />
      ),
    },
  ],
}
