// QA fixture, broken on purpose: a character the font subset does not hold. It is written as a code point so the
// subset script, which collects every character in src/, does not pick it up. Expected: "system font".
import { definePrint, Stack, Text, Title } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', viewing: { distanceM: 2 },
  render: () => <Stack><Title lines={['标题']} /><Text>{String.fromCodePoint(0x9f98)}</Text></Stack>,
})
