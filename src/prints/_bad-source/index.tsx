// QA fixture, broken on purpose: a number with no source. Expected: "no source".
import { definePrint, Stack, Text, Title } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', viewing: { distanceM: 2 },
  render: () => <Stack><Title lines={['标题']} /><Text>销量增长了 300%</Text></Stack>,
})
