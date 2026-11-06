// Event big screen with a schedule. Everything on it is an invented sample, and it says so on every scene.
import { Agenda, Board, Hero, NowNext, defineScreen } from '../../screen'
import { SAMPLE, parseEvent, type EventData } from './data'

const SOURCE = '全部为虚构示例数据，活动、嘉宾、房间和 Wi-Fi 均不存在'

export const screen = defineScreen<EventData>({
  title: '星桥开发者日（虚构）',
  theme: 'amber',
  face: 'heavy',
  atmosphere: 'grid',
  orientation: 'both',
  // A 5 m wide LED wall in a lobby, its text above head height, to be read from 10 m.
  venue: { longEdgeMm: 5000, distanceM: 10, baselineM: 2.2, panel: 'led' },
  sample: '示例数据 · 虚构活动',
  clock: { date: true },
  reloadAt: '04:00',
  data: { initial: SAMPLE, parse: parseEvent, everySec: 30, staleAfterSec: 120 },
  agenda: (d) => d.sessions,
  ticker: {
    label: '通知',
    items: ({ data }) => data.notices.map((n) => ({ text: n.text, when: n.when })),
  },
  states: [
    { at: '08:20', label: '开场前' },
    { at: '09:15', label: '进行中' },
    { at: '10:35', label: '茶歇' },
    { at: '11:35', label: '场间' },
    { at: '12:40', label: '午餐' },
    { at: '17:30', label: '散场后' },
  ],
  scenes: [
    { id: 'now', label: '正在进行', seconds: 14, render: () => <NowNext source={SOURCE} /> },
    { id: 'agenda', label: '议程', seconds: 18, render: () => <Agenda source={SOURCE} /> },
    {
      id: 'welcome',
      label: '欢迎',
      seconds: 9,
      when: { from: '06:00', to: '09:30' },
      render: () => <Hero kicker="早上好" title={['欢迎来到', '星桥开发者日']} portraitTitle={['欢迎来到', '星桥', '开发者日']} sub="签到台在一层入口右侧。" source={SOURCE} />,
    },
    {
      id: 'rooms',
      label: '房间',
      seconds: 11,
      render: () => (
        <Board
          title="各厅怎么走"
          rows={[
            { left: '主会场', right: '一层，正门直行' },
            { left: '东厅', right: '二层，电梯右转' },
            { left: '西厅', right: '二层，电梯左转' },
          ]}
          source={SOURCE}
        />
      ),
    },
    {
      id: 'wifi',
      label: 'Wi-Fi',
      seconds: 8,
      when: { from: '06:00', to: '17:00' },
      render: () => <Board title="现场 Wi-Fi" rows={[{ left: '网络', right: 'DEMO-GUEST' }, { left: '密码', right: 'sample-2026' }]} source={SOURCE} />,
    },
    {
      id: 'lunch',
      label: '午餐',
      seconds: 9,
      when: { from: '12:00', to: '13:30' },
      render: () => <Hero kicker="午餐时间" title={['午餐在', '二层餐厅']} sub="13:30 东厅继续。" source={SOURCE} />,
    },
    {
      id: 'bye',
      label: '散场',
      seconds: 10,
      when: { from: '16:20', to: '23:59' },
      render: () => <Hero kicker="今天到此结束" title={['感谢到场']} sub="离场请走一层北门。" source={SOURCE} />,
    },
  ],
})
