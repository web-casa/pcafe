import type { DeckDef } from '../../kit'
import { NumberTiles, ScoreTable } from '../../kit'

export const deck: DeckDef = {
  title: '模印 · 专属版式',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'stencil',
  slides: [
    {
      id: 'tiles',
      label: '数字色块',
      build: 'reveal',
      render: () => (
        <NumberTiles
          kicker="写演示的四条规矩"
          title="先守规矩，再谈好看"
          tiles={[
            { title: '只组合模板', body: '版式交给模板，不写自定义样式。' },
            { title: '放不下就拆页', body: '每个字段有上限，超了就拆，不缩字号。' },
            { title: '事实要有出处', body: '数字写明来源，查不到的不写。' },
            { title: '检查通过才算完', body: 'check 输出 PASS，再逐页看截图。' },
          ]}
          source="skills/pcafe/SKILL.md"
        />
      ),
    },
    {
      id: 'score',
      label: '评分表',
      build: 'reveal',
      render: () => (
        <ScoreTable
          kicker="三种出口"
          title="放映、PDF、PPTX 怎么选"
          corner="要求"
          columns={['HTML 放映', 'PDF', 'PPTX']}
          rows={[
            { label: '离线打开', cells: [{ text: '可以', tone: 'good' }, { text: '可以', tone: 'good' }, { text: '可以', tone: 'good' }] },
            { label: '按键动效', cells: [{ text: '有', tone: 'good' }, { text: '最终画面', tone: 'mid' }, { text: '最终画面', tone: 'mid' }] },
            { label: '直接改字', cells: [{ text: '改源文件', tone: 'plain' }, { text: '不能', tone: 'bad' }, { text: '文本框', tone: 'good' }] },
            { label: '演讲备注', cells: [{ text: '演讲者视图', tone: 'good' }, { text: '不带', tone: 'bad' }, { text: 'PPT 备注', tone: 'good' }] },
          ]}
          source="docs/zh-CN/presenting.md"
        />
      ),
    },
  ],
}
