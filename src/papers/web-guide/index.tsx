// A web-first report (view: 'read'): how a PCafe deck gets made. Counts are read from
// the kit itself; the chat and app panels are mock interfaces and say so on screen.
import { freeCatalog } from '../../kit/catalog'
import { STYLES, THEMES } from '../../kit/theme'
import { Apps, Callout, Chat, Cover, H1, H2, List, P, SourceList, Stats, Steps, type ReportDef } from '../../paper'

const N_TEMPLATES = freeCatalog.length
const N_STYLES = Object.keys(STYLES).length
const N_THEMES = Object.keys(THEMES).length
const KIT = '数据：本项目 src/kit/catalog.ts 与 src/kit/theme.ts，构建时读取 [^kit]'

export const paper: ReportDef = {
  kind: 'report',
  title: '一份演示是怎么做出来的',
  theme: 'cobalt',
  look: 'formal',
  view: 'read',
  footer: 'PCafe 示例 · 网页阅读版',
  sources: {
    kit: { org: 'PCafe', title: 'src/kit/catalog.ts · src/kit/theme.ts', note: '模板与风格数量在构建时从代码读取。' },
    skill: { org: 'PCafe', title: 'skills/pcafe/SKILL.md', note: '写演示的流程。' },
  },
  blocks: [
    <Cover
      kicker="网页阅读版 · 示例"
      title={['一份演示', '是怎么做出来的']}
      subtitle="从一段笔记到一个能离线打开的 HTML 文件，中间只有五步。"
      numeral={String(N_TEMPLATES)}
      numeralLabel="个固定模板，每个都写明内容上限"
      facts={[{ label: '风格', value: `${N_STYLES} 种` }, { label: '配色', value: `${N_THEMES} 套` }]}
    />,
    <H1>五步做完</H1>,
    <P lead>写演示不是从空白页开始排版，而是把内容一段段对上现成的模板。[^skill]</P>,
    <Steps
      steps={[
        { title: '收集事实', body: '每个数字记下出处' },
        { title: '写故事线', body: '每页先定一句话' },
        { title: '配模板', body: '按内容的形状挑' },
        { title: '压进上限', body: '放不下就拆页' },
        { title: '检查看图', body: 'PASS 后逐页看' },
      ]}
    />,
    <H2>和 AI 一起写</H2>,
    <P>多数时候是把笔记交给 AI，让它按 skill 的流程选模板、写 deck 文件、跑检查。下面是一段示意对话。</P>,
    <Chat
      app="写作助手"
      caption="示意界面：展示对话的形状，不是真实记录"
      messages={[
        { from: 'user', text: '把这份季度复盘笔记做成 12 页左右的演示，正式一点。' },
        { from: 'bot', text: '先列故事线：现状、三个发现、下季度计划。风格用 editorial，配色 cobalt。' },
        { from: 'user', text: '第二个发现的数字要有出处。' },
        { from: 'bot', text: '已改用带 source 的模板，检查通过。', card: { title: 'check 结果', rows: [['页数', '12'], ['问题', '0'], ['措辞提示', '2 条']] } },
      ]}
    />,
    <H1>一份演示里有什么</H1>,
    <Stats
      items={[
        { value: String(N_TEMPLATES), label: '固定模板' },
        { value: String(N_STYLES), label: '风格' },
        { value: String(N_THEMES), label: '配色' },
      ]}
      source={KIT}
    />,
    <P>模板决定版式和内容上限，风格决定字体与装饰，配色决定强调色。三者互相独立，换风格不需要改内容。</P>,
    <H2>同一份内容，三种出口</H2>,
    <Apps
      caption="示意界面：三种导出方式各自生成的文件"
      cards={[
        { app: '放映', title: '单个 HTML 文件', fields: [{ label: '打开方式', value: '浏览器，离线' }, { label: '演讲者视图', value: '按 S' }], status: { text: '默认' } },
        { app: '导出', title: 'PDF', fields: [{ label: '命令', value: 'build 后打印' }, { label: '适合', value: '会后分发' }], status: { text: '可选', tone: 'wait' } },
        { app: '导出', title: 'PPTX', fields: [{ label: '命令', value: 'pcafe pptx' }, { label: '文字', value: '可编辑' }], status: { text: '可选', tone: 'wait' } },
      ]}
    />,
    <H1>局限</H1>,
    <List items={['模板固定，不写自定义 CSS；放不下的内容要拆页。', 'PPTX 里只有纯文字可编辑，图形留在背景图中。']} />,
    <Callout title="这一页本身" tone="note">这是一份 view: 'read' 的报告：默认以网页文章打开，也能切到 A4 纸张视图或存成 PDF。</Callout>,
    <H1>来源</H1>,
    <SourceList />,
  ],
}
