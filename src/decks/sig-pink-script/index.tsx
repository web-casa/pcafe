import type { DeckDef } from '../../kit'
import { ChapterNumber, Statement } from '../../kit'

export const deck: DeckDef = {
  title: '夜粉 · 专属版式',
  iconStyle: 'line-duotone',
  theme: 'crimson',
  style: 'pink-script',
  slides: [
    {
      id: 'chapter',
      label: '章节大数字',
      render: () => (
        <ChapterNumber
          kicker="第二章"
          num="02"
          title={['一个文件，', '到哪都能放']}
          body="字体、图片和代码都打包进同一个 HTML 文件，放映时不用联网。"
          foot={['第 2 章 · 共 4 章（示意）', '放映与交付']}
        />
      ),
    },
    {
      id: 'about',
      label: '这种风格',
      render: () => (
        <Statement
          kicker="夜粉 · ChapterNumber"
          text={['大数字', '告诉听众', '讲到哪了。']}
          sub="发光的章节号配短标题，适合长演示里的章节开头。"
        />
      ),
    },
  ],
}
