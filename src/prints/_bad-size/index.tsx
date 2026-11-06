// QA fixture, broken on purpose: a size set by hand, below the floor for the distance. Expected: "under".
import { definePrint, Stack, Title } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', viewing: { distanceM: 2 },
  render: () => <Stack><Title lines={['标题']} /><p style={{ fontSize: '2mm' }} data-tier="read">这行字太小了</p></Stack>,
})
