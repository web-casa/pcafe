// Shows emoji inside ordinary templates: type them in any text field. No outside facts here.
import type { DeckDef } from '../../kit'
import { Closing, Cover, NumberedColumns } from '../../kit'

export const deck: DeckDef = {
  title: '在演示里用 Emoji',
  theme: 'cobalt',
  emojiStyle: 'fluent',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="Emoji 🎨 示例"
          title="重点先被看到 👀"
          subtitle="emoji"
          lead="在任何文字字段里直接打 emoji，渲染、导出和打印用的都是同一套图形 ✨"
          facts={[
            { label: '系列', value: 'fluent' },
            { label: '页数', value: '3 页' },
            { label: '联网', value: '不需要' },
          ]}
          numeral="01"
          hint={<>按 <kbd>→</kbd> 翻页</>}
        />
      ),
    },
    {
      id: 'when',
      label: '什么时候用',
      render: () => (
        <NumberedColumns
          kicker="用法 🧭"
          title="一页一两个，放在要被记住的地方"
          lead="emoji 用来提示情绪和分类，不用来代替文字。"
          items={[
            { tag: 'mark', title: '🚀 标记重点', body: '放在小标题开头，让人扫一眼就知道这一条讲什么。' },
            { tag: 'tone', title: '😅 交代语气', body: '内部分享、复盘这类轻松场合，比图标更有人味。' },
            { tag: 'avoid', title: '⚠️ 严肃场合慎用', body: '财报、法务和事故通报，继续用图标和数字更稳。' },
          ]}
          source="示例内容，没有外部事实"
        />
      ),
    },
    {
      id: 'closing',
      label: '结论',
      render: () => (
        <Closing
          kicker="结论"
          statement="直接打 emoji 就行 ✅"
          follow="整份演示的系列写在 emojiStyle 里，换一个词就全部换掉 🔁"
          takeaways={['🧩 标题、正文和表格，任何模板的文字字段都能直接用', '🖨️ 导出 PDF 和打印时不依赖系统字体，不会变成方块', '📦 构建时只打包实际用到的 emoji，文件不会明显变大']}
          refs={['docs/en/guide.md', 'src/assets/emoji']}
        />
      ),
    },
  ],
}
