// Starter report. Replace the text, keep the structure. Every figure needs a source.
import { Callout, Cover, DocBars, Figure, H1, H2, List, P, SourceList, Stats, Table, Toc, type ReportDef } from '../../paper'

export const paper: ReportDef = {
  kind: 'report',
  title: '报告标题',
  theme: 'crimson',
  look: 'editorial',
  footer: '你的组织',
  sources: {
    sample: { org: '来源机构', title: '文档或数据集名称', url: 'https://example.com/data', note: '下载日期。' },
  },
  blocks: [
    <Cover kicker="报告类型" title={['报告标题']} subtitle="用一句话说明这份报告回答什么问题。" numeral="00%" numeralLabel="这份报告最重要的一个数" facts={[{ label: '作者', value: '姓名' }, { label: '日期', value: '2026 年 1 月' }]} note="示例数字，写报告时请换成有出处的真实数据。" />,
    <Toc />,
    <H1>摘要</H1>,
    <P lead>先写结论。读者只看这一段，也应该知道发生了什么、该做什么。</P>,
    <P>第二段说明范围和方法：这份报告看了什么数据，没有看什么。引用写成这样，文末自动生成来源列表。[^sample]</P>,
    <Stats items={[{ value: '00', label: '指标一' }, { value: '00%', label: '指标二' }]} source="示例数字。真实报告在这里写来源 [^sample]" />,
    <H1>分析</H1>,
    <H2>第一个发现</H2>,
    <P>正文段落可以跨页，表格超过 12 行也可以跨页并重复表头。图不会被切开。</P>,
    <Figure caption="图题说明这张图展示了什么" source="示例数字 [^sample]">
      <DocBars items={[{ name: '甲', value: 42, focus: true }, { name: '乙', value: 31 }, { name: '丙', value: 18 }]} unit="%" />
    </Figure>,
    <Table caption="表题说明这张表列了什么" source="示例数字 [^sample]" columns={[{ label: '项目' }, { label: '数值', num: true }]} rows={[['甲', 42], ['乙', 31], ['丙', 18]]} focus={[0]} />,
    <H1>结论</H1>,
    <List ordered items={['第一条结论。', '第二条结论。']} />,
    <Callout title="局限" tone="note">写清楚这份报告没有回答什么。</Callout>,
    <H1>来源</H1>,
    <SourceList />,
  ],
}
