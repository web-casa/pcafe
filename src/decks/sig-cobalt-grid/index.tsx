import type { DeckDef } from '../../kit'
import { IndexList, Statement } from '../../kit'

export const deck: DeckDef = {
  title: '索引 · 专属版式',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'cobalt-grid',
  slides: [
    {
      id: 'index',
      label: '分栏索引',
      build: 'reveal',
      render: () => (
        <IndexList
          kicker="文档目录"
          title="文档里的六个入口"
          entries={[
            { title: '写作流程', body: '从故事线到检查通过的完整步骤。' },
            { title: '模板目录', body: '每个模板的用途、字段和内容上限。' },
            { title: '放映与导出', body: '演讲者视图、打印成 PDF、导出 PPTX。' },
            { title: '报告与简历', body: '同一套组件排成可打印的长文档。' },
            { title: '视频与课件', body: '把页面录成 MP4，或做成可交互的课件。' },
            { title: '参与贡献', body: '新增模板和风格时要遵守的规则。' },
          ]}
          source="docs/zh-CN/：guide、components、presenting、paper、video / course、contributing"
        />
      ),
    },
    {
      id: 'about',
      label: '这种风格',
      render: () => (
        <Statement
          kicker="索引 · IndexList"
          text={['像一本刊物的', '目录页。']}
          sub="细线分栏、编号条目，适合研究简报、年报和文档导览。"
        />
      ),
    },
  ],
}
