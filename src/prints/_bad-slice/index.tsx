// QA fixture, broken on purpose: one section too tall for either slice profile. Expected: "cannot fit an xhs slice" and "over 3000 px".
import { definePrint, Heading, Text } from '../../print'
export const print = definePrint({
  title: 'bad', format: 'long', preset: 'long-1080', slices: ['wechat', 'xhs'],
  sections: [{ id: 'tall', source: '示例', render: () => <><Heading>一段太长</Heading><div style={{ height: '3200px' }} /><Text>到底了</Text></> }],
})
