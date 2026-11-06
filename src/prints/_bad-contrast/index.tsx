// QA fixture, broken on purpose: dark text on a dark band. Expected: "contrast".
import { Bleed, definePrint, Stack, Text, Title } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', viewing: { distanceM: 2 },
  render: () => (
    <Stack>
      <Bleed fill="ink" />
      <Title lines={['标题']} />
      <Text>看不见的文字</Text>
    </Stack>
  ),
})
