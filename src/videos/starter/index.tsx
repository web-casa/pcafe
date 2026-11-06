// A starting point: copy this folder, change the words, then run the check.
// Scenes reuse the kit's slide templates. Limits and rules: docs/en/video.md.
import { Closing, NumberOpener, NumberedColumns } from '../../kit'
import type { VideoDef } from '../../video'

export const video: VideoDef = {
  title: 'My video',
  size: '16:9',
  fps: 30,
  theme: 'cobalt',
  transition: 'fade',
  preroll: 1,
  scenes: [
    {
      id: 'open',
      duration: 4,
      noFacts: true,
      caption: '第一句话就讲结论。',
      render: () => <NumberOpener kicker="示例 · 替换成你的主题" value="3" text={['三件事', '看完这条视频']} sub="这里的数字只是占位" source="示例内容，没有外部事实" />,
    },
    {
      id: 'points',
      duration: 8,
      noFacts: true,
      steps: [0.6, 2.6, 4.6],
      caption: [
        { at: 0, text: '一个场景只讲一件事。' },
        { at: 2.6, text: '字幕一次只放一句。' },
        { at: 4.6, text: '有事实的场景要写出处。' },
      ],
      render: () => (
        <NumberedColumns
          kicker="要点"
          title="标题写观点，不写话题"
          lead="换成你的内容，超出上限就拆成两个场景。"
          items={[
            { tag: 'one', title: '第一个要点', body: '用一到两句话说明，写具体的名词和数字。' },
            { tag: 'two', title: '第二个要点', body: '三个要点的分量相当，长度也尽量接近。' },
            { tag: 'three', title: '第三个要点', body: '有先后顺序的内容，改用步骤类模板。' },
          ]}
          source="示例内容，没有外部事实"
        />
      ),
    },
    {
      id: 'end',
      duration: 4,
      noFacts: true,
      caption: '最后只提一个要求。',
      render: () => <Closing kicker="结尾" mark="01" statement="最后只提一个要求。" follow="告诉观众接下来做什么。" takeaways={['第一条要点', '第二条要点', '第三条要点']} refs={['示例内容']} />,
    },
  ],
}
