// QA fixture, broken on purpose: a headline wider than the safe zone. Expected: "outside the safe zone".
import { definePrint, Stack, Title } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', viewing: { distanceM: 1 },
  render: () => <Stack><Title lines={['这一行标题比安全区宽得多']} scale={1.1} /></Stack>,
})
