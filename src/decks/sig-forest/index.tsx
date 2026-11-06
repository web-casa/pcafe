import type { DeckDef } from '../../kit'
import { AgendaMosaic, Statement } from '../../kit'

export const deck: DeckDef = {
  title: '林间 · 专属版式',
  iconStyle: 'line-duotone',
  theme: 'crimson',
  style: 'forest',
  slides: [
    {
      id: 'agenda',
      label: '议程拼块',
      render: () => (
        <AgendaMosaic
          kicker="议程"
          title="今天讲五件事"
          aside="五个议题"
          items={[
            { title: '为什么用模板写演示', tag: '背景' },
            { title: '模板和字数上限', tag: '做法' },
            { title: '事实要有出处', tag: '规矩' },
            { title: '检查怎么跑', tag: '质量' },
            { title: '放映与导出', tag: '交付' },
          ]}
        />
      ),
    },
    {
      id: 'about',
      label: '这种风格',
      render: () => (
        <Statement
          kicker="林间 · AgendaMosaic"
          text={['议程不一定', '是一列清单。']}
          sub="一块深色高块加四块小色块，开场时让听众一眼看到全部议题。"
        />
      ),
    },
  ],
}
