// A starting point: copy this folder, change the words, then run the check.
// Every field and its limit is described in src/cards/types.ts.
import type { CardSetDef } from '../../cards'

export const set: CardSetDef = {
  title: 'My card set',
  preset: 'xhs-portrait',
  theme: 'cobalt',
  cards: [
    {
      t: 'cover',
      kicker: '一句话说明主题',
      lines: ['三五个字', '说清钩子'],
      mark: [1],
      sub: '补一句，别重复标题',
      hint: '左滑',
      source: null,
    },
    {
      t: 'list',
      title: '每张卡只讲一件事',
      items: [
        { head: '先写结论', body: '标题是发现，不是话题。' },
        { head: '事实带出处', body: '有数字的卡片必须写 source。' },
        { head: '放不下就拆', body: '字号不会缩，超了 QA 会报错。' },
      ],
      source: null,
    },
    {
      t: 'ending',
      lines: ['最后一张', '只提一个要求'],
      mark: [1],
      cta: '你想看什么？评论区告诉我',
      source: null,
    },
  ],
}
