// Long image for WeChat and Xiaohongshu. Each section is a unit: slices cut between sections and never inside one,
// so a section has to fit in 1440 px if you ask for xhs, and carries its own source because a slice travels alone.
import { Steps } from './shared'
import { definePrint, Heading, Kicker, Text, Title } from '../../print'

const SOURCE = '把事实的出处写在这里。这份示例没有事实，只有占位文字'

export const print = definePrint({
  title: '长图示例',
  format: 'long',
  preset: 'long-1080',
  theme: 'amber',
  style: 'mono-studio',
  tone: 'dark',
  emojiStyle: 'noto',
  sample: '示例内容 · 虚构',
  slices: ['wechat', 'xhs'],
  sections: [
    {
      id: 'hero',
      source: SOURCE,
      render: () => (
        <>
          <Kicker>小标题写在这里</Kicker>
          <Title lines={['长图的', '第一屏']} mark={[1]} fit />
          <Text scale={1.5}>第一屏决定读者要不要继续往下滑。</Text>
        </>
      ),
    },
    {
      id: 'steps',
      source: SOURCE,
      render: () => (
        <>
          <Heading scale={2}>每一段讲一件事</Heading>
          <Text>段落是切图的最小单位。</Text>
          <Steps narrow />
        </>
      ),
    },
  ],
})
