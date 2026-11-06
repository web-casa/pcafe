// QA fixture, broken on purpose: a kit selector that is not in the template. Expected: "not found in its template".
import { StepTrack } from '../../kit'
import { definePrint, Kit, Stack, Title } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', viewing: { distanceM: 2 },
  render: () => <Stack><Title lines={['标题']} /><Kit part=".no-such-part" label="没有"><StepTrack kicker="" title="" steps={[{ title: '一', body: '二' }]} /></Kit></Stack>,
})
