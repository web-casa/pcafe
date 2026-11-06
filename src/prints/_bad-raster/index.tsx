// QA fixture, broken on purpose: a 960 px picture stretched across an A3 sheet. Expected: "under 300 ppi".
import { Bleed, definePrint, Stack, Text, Title } from '../../print'
import lunar from '../../decks/v2-p2/assets/decor-lunar-surface.webp'
export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', viewing: { distanceM: 2 },
  render: () => (
    <Stack>
      <Bleed><img src={lunar} alt="" style={{ width: '100%' }} /></Bleed>
      <Title lines={['标题']} />
      <Text>文字</Text>
    </Stack>
  ),
})
