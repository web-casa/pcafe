// QA fixture, broken on purpose: a line that runs across a fold. Expected: "crosses the fold".
import { definePrint, Stack, Text, Title, type TrifoldPanel } from '../../print'
const empty: TrifoldPanel = { render: () => <Stack><Text>空白</Text></Stack> }
export const print = definePrint({
  title: 'bad', format: 'trifold', preset: 'trifold-a4',
  outside: { flap: { render: () => <Stack><Title lines={['这一行字跨过了折线继续往右走']} tier="read" scale={5} /></Stack> }, back: empty, cover: empty },
  inside: { left: empty, middle: empty, right: empty },
})
