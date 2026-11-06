import type { DeckDef } from '../../kit'
import { AppCards, ChatDemo } from '../../kit'

export const deck: DeckDef = {
  title: '拟真界面 · 两个模板',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'standard',
  slides: [
    {
      id: 'chat',
      label: '对话演示',
      build: 'reveal',
      render: () => (
        <ChatDemo
          kicker="对话演示"
          title={['一句话，', '换一份演示']}
          lead="用一段示意对话展示怎么用，比列功能清楚。每按一次 → 出现一条消息。"
          notes={['窗口上标着「示意界面」', '结果卡片写清楚改了什么']}
          app="写作助手"
          messages={[
            { from: 'user', text: '把这份季度复盘做成 12 页左右的演示。' },
            { from: 'bot', text: '先列故事线：现状、三个发现、下季度计划。' },
            { from: 'user', text: '第二个发现的数字要有出处。' },
            { from: 'bot', text: '已改用带出处的模板，检查通过。', card: { title: 'check 结果', rows: [['页数', '12'], ['问题', '0']] } },
          ]}
          source="示意界面：展示对话的形状，不是真实记录"
        />
      ),
    },
    {
      id: 'apps',
      label: '后台卡片',
      build: 'reveal',
      render: () => (
        <AppCards
          kicker="三种出口"
          title="同一份内容，三种文件"
          lead="把要说明的东西直接填进界面里，读者一眼看到结果。"
          cards={[
            { app: '放映', title: '单个 HTML 文件', fields: [{ label: '打开方式', value: '浏览器，离线' }, { label: '演讲者视图', value: '按 S' }, { label: '阅读视图', value: '#/read' }], tags: ['默认'], status: { text: '可用' } },
            { app: '导出', title: 'PDF', fields: [{ label: '打开', value: '#/print' }, { label: '适合', value: '会后分发' }, { label: '逐条展开', value: '全部显示' }], tags: ['A4', '16:9'], status: { text: '可用' } },
            { app: '导出', title: 'PPTX', fields: [{ label: '命令', value: 'pcafe pptx' }, { label: '文字', value: '可编辑' }, { label: '备注', value: '写进 PPT 备注' }], tags: ['PowerPoint'], status: { text: '新', tone: 'wait' } },
          ]}
          source="示意界面；命令见 docs/zh-CN/presenting.md"
        />
      ),
    },
  ],
}
