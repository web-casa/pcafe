// Roll-up banner. The bottom 150 mm rolls into the cassette and the top 10 mm goes into the rail by default:
// ask your printer for their real numbers and set hiddenBottomMm and topBarMm. The band's height is in mm, so
// change it with the preset: QA fails text that lands half on it.
import { Steps } from './shared'
import { Bleed, definePrint, Kicker, Sources, Spring, Stack, Text, Title, Tone } from '../../print'

export const print = definePrint({
  title: '易拉宝示例',
  format: 'rollup',
  preset: 'rollup-80x200',
  theme: 'emerald',
  style: 'poster',
  tone: 'light',
  emojiStyle: 'noto',
  sample: '示例内容 · 虚构',
  viewing: { distanceM: 3, readM: 1.5, nearM: 0.8 },
  render: () => (
    <Stack grow gap={40}>
      <Bleed top={0} height={360} fill="ink" />
      <Tone tone="dark">
        <Stack gap={14}>
          <Kicker>小标题写在这里</Kicker>
          <Title lines={['走过时先看到', '这几个字']} mark={[1]} fit />
        </Stack>
      </Tone>
      <Text scale={2}>重要内容放在视线高度。越靠近地面的内容越少有人看到。</Text>
      <Steps narrow />
      <Spring />
      <Sources>来源：把事实的出处写在这里。这份示例没有事实，只有占位文字。</Sources>
    </Stack>
  ),
})
