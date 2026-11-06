// A4 tri-fold. Outside, cover up: fold-in 97, back 100, cover 100 mm. Inside: left 100, middle 100, fold-in 97 mm.
// Fold the 97 mm panel in first, then the cover over it. Each panel is its own column, so nothing crosses a fold.
import { Steps } from './shared'
import { definePrint, Heading, Kicker, Sources, Spring, Stack, Text, Title } from '../../print'

const panel = (kicker: string, heading: string, body: string) => () => (
  <Stack grow gap={5}>
    <Kicker>{kicker}</Kicker>
    <Heading scale={1.9}>{heading}</Heading>
    <Text>{body}</Text>
  </Stack>
)

export const print = definePrint({
  title: '三折页示例',
  format: 'trifold',
  preset: 'trifold-a4',
  theme: 'violet',
  style: 'editorial',
  tone: 'light',
  emojiStyle: 'noto',
  sample: '示例内容 · 虚构',
  outside: {
    flap: { render: panel('翻开先看', '合上时最先看到这一面', '读者翻开封面，先看到这里。写一个让人继续往里翻的理由。') },
    back: {
      render: () => (
        <Stack grow gap={5}>
          <Kicker>封底</Kicker>
          <Heading scale={1.9}>出处放在这里</Heading>
          <Text>封底适合放出处和说明。真实的联系方式和二维码由你提供，这里不编造。</Text>
          <Spring />
          <Sources>来源：把事实的出处写在这里。这份示例没有事实，只有占位文字。</Sources>
        </Stack>
      ),
    },
    cover: {
      tone: 'accent',
      render: () => (
        <Stack grow gap={6}>
          <Kicker>小标题</Kicker>
          <Title lines={['折页', '标题']} fit />
          <Text scale={1.25} strong>一句话说明这份折页讲什么。</Text>
        </Stack>
      ),
    },
  },
  inside: {
    left: { render: panel('第一面', '先讲最重要的', '三面展开后同时可见，从左往右读。') },
    middle: { fill: 'wash', render: () => (
      <Stack grow gap={5}>
        <Kicker>第二面</Kicker>
        <Heading scale={1.9}>放一个模板部件</Heading>
        <Steps narrow />
      </Stack>
    ) },
    right: {
      render: () => (
        <Stack grow gap={5}>
          <Kicker>第三面</Kicker>
          <Heading scale={1.9}>最后这一面窄一点</Heading>
          <Text>这一面折在最里面，所以比其他两面窄。</Text>
          <Spring />
          <Sources>来源：把事实的出处写在这里。这份示例没有事实，只有占位文字。</Sources>
        </Stack>
      ),
    },
  },
})
