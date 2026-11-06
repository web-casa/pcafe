import type { DeckDef } from '../../kit'
import { StackBars, Statement } from '../../kit'

export const deck: DeckDef = {
  title: '号外 · 专属版式',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'broadside',
  slides: [
    {
      id: 'stack',
      label: '阶梯层级',
      build: 'reveal',
      render: () => (
        <StackBars
          kicker="分层"
          title="一份演示由五层叠成"
          lead="越往上越常改：写演示时只动最上面一层。"
          layers={[
            { name: '内容', note: 'src/decks 里的 deck 文件' },
            { name: '模板', note: 'src/kit 里的版式组件' },
            { name: '风格', note: '字体、圆角、底色和装饰' },
            { name: '配色', note: '主题色与纸色' },
            { name: '引擎', note: '翻页、逐条展开、演讲者视图' },
          ]}
          source="项目目录结构：src/decks、src/kit、src/styles、src/kit/theme.ts、src/deck"
        />
      ),
    },
    {
      id: 'about',
      label: '这种风格',
      render: () => (
        <Statement
          kicker="号外 · StackBars"
          text={['一层压一层，', '越往上越常改。']}
          sub="逐层错开的横条，适合技术栈、组织层级和优先级。"
        />
      ),
    },
  ],
}
