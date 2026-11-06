// A starting point: copy this folder, change the words, then run the check.
// Text sizes are computed from `venue`, so describe the real place first. Rules: docs/en/screen.md.
import { Board, Hero, defineScreen } from '../../screen'

const SOURCE = '全部为虚构示例，换成你的内容和出处'

export const screen = defineScreen({
  title: '我的展示屏（示例）',
  theme: 'cobalt',
  face: 'grotesk',
  atmosphere: 'none',
  orientation: 'landscape',
  // A 65-inch panel, to be read from 3 m.
  venue: { diagonalIn: 65, distanceM: 3 },
  sample: '示例内容',
  clock: { date: true },
  reloadAt: '04:00',
  scenes: [
    {
      id: 'welcome',
      label: '欢迎',
      seconds: 10,
      render: () => <Hero kicker="欢迎" title={['一屏只讲', '一件事']} sub="路过的人只会看几秒。" source={SOURCE} />,
    },
    {
      id: 'board',
      label: '清单',
      seconds: 14,
      render: () => <Board kicker="今天" title="三件事" rows={[{ left: '上午', right: '开放参观' }, { left: '下午', right: '现场讲解' }, { left: '晚上', right: '闭馆' }]} source={SOURCE} />,
    },
  ],
})
