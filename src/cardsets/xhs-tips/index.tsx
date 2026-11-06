// 小红书 notes with emoji: advice with no outside facts, so nothing here needs a source.
import type { CardSetDef } from '../../cards'

export const set: CardSetDef = {
  title: '上台前的救场清单',
  preset: 'xhs-portrait',
  theme: 'crimson',
  style: 'standard',
  handle: 'PCafe',
  cards: [
    {
      t: 'cover',
      tone: 'paper',
      kicker: '🎤 演讲新手',
      lines: ['上台前', '这样救场'],
      mark: [1],
      sub: '紧张、忘词、设备坏了都不慌 ✨',
      motif: { kind: 'emoji', e: '🎤', around: ['✨', '💡', '🔥'] },
      hint: '左滑',
      source: null,
    },
    {
      t: 'list',
      tone: 'paper',
      kicker: '😰 紧张',
      title: '手抖心跳，先做这三件事',
      items: [
        { head: '🧘 慢慢呼气', body: '上台前把气呼长，比“别紧张”有用。' },
        { head: '👀 找一张友善的脸', body: '先讲给一个人听，再看全场。' },
        { head: '🥤 手边放杯水', body: '停顿喝一口，也是在整理思路。' },
      ],
      source: null,
    },
    {
      t: 'list',
      tone: 'wash',
      kicker: '🤯 忘词',
      title: '脑子空白时别道歉',
      items: [
        { head: '🔁 重复上一句', body: '听众只觉得你在强调。' },
        { head: '❓ 反问一句', body: '“这件事为什么重要？”给自己争取时间。' },
        { head: '📌 看下一页标题', body: '标题写观点，就是你的提词器。' },
      ],
      source: null,
    },
    {
      t: 'steps',
      tone: 'paper',
      kicker: '🔌 设备',
      title: '开场前五分钟检查',
      steps: [
        { head: '💻 接好投影，翻到最后一页', body: '确认动画和字体都正常。' },
        { head: '🔋 插上电源', body: '别让电脑在讲到一半时休眠。' },
        { head: '📁 手机里存一份离线文件', body: '电脑坏了，也能换机继续。' },
      ],
      source: null,
    },
    {
      t: 'ending',
      tone: 'ink',
      lines: ['先讲完', '再讲好 💪'],
      mark: [1],
      takeaways: ['🧘 紧张就把气呼长', '🔁 忘词就重复上一句', '📁 永远带一份离线文件'],
      cta: '你最怕哪种翻车？评论区聊 💬',
      source: null,
    },
  ],
}
