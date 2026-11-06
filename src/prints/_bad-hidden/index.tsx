// QA fixture, broken on purpose: text pushed into the part the cassette swallows. Expected: "hidden bottom".
import { definePrint, Stack, Text, Title } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'rollup', preset: 'rollup-80x200', viewing: { distanceM: 3 },
  render: () => (
    <Stack>
      <Title lines={['标题']} />
      <div style={{ height: '1960mm' }} />
      <Text scale={2}>重要的联系方式写在了最下面</Text>
    </Stack>
  ),
})
