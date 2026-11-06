// QA fixture, broken on purpose: fluent emoji, which Chrome rasterises at 300 ppi, on a piece that asks for 600.
// Expected: a raster under the target, with the hint to use noto.
import { definePrint, Stack, Text, Title } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'poster', preset: 'poster-a3', emojiStyle: 'fluent', targetDpi: 600, viewing: { distanceM: 2 },
  render: () => <Stack><Title lines={['🚀']} /><Text>一个火箭</Text></Stack>,
})
