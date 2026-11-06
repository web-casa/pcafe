// QA fixture, broken on purpose: more content than the sheet holds. Expected: "too tall" or "past the live area".
import { definePrint, Stack, Text } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', viewing: { distanceM: 2 },
  render: () => <Stack gap={10}>{Array.from({ length: 40 }, (_, i) => <Text key={i} scale={1.6}>一段放不下的内容。</Text>)}</Stack>,
})
