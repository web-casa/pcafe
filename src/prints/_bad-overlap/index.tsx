// QA fixture, broken on purpose: one text on top of another. Expected: "overlaps text".
import { definePrint, Stack, Text, Title } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', viewing: { distanceM: 2 },
  render: () => (
    <Stack>
      <Title lines={['标题']} />
      <div style={{ marginTop: '-30mm' }}><Text scale={2}>压在标题上面的一行字</Text></div>
    </Stack>
  ),
})
