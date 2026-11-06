// Poster. Text sizes come from `viewing`, so say where it hangs before you write anything.
// `sample` puts a label on the sheet: remove it only when every fact is real and has a source.
import { Steps } from './shared'
import { definePrint, Kicker, Sources, Spring, Stack, Text, Title } from '../../print'

export const print = definePrint({
  title: '海报示例',
  format: 'poster',
  preset: 'poster-a2',
  theme: 'cobalt',
  style: 'editorial',
  tone: 'light',
  emojiStyle: 'noto',
  sample: '示例内容 · 虚构',
  viewing: { distanceM: 3, readM: 1.2, nearM: 0.6 },
  render: () => (
    <Stack grow gap={12}>
      <Kicker>小标题写在这里</Kicker>
      <Title lines={['一张海报', '只说一件事']} mark={[1]} fit />
      <Text scale={1.5}>再用一两句话说明它。放不下就删字，不要缩小：字号由观看距离决定。</Text>
      <Spring />
      <Steps />
      <Sources>来源：把事实的出处写在这里。这份示例没有事实，只有占位文字。</Sources>
    </Stack>
  ),
})
