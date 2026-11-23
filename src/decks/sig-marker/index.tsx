// Signature templates for the `marker` style. 周拾 is a made-up designer and every
// project and figure is illustrative. All pictures are AI-generated decorative
// illustrations (decor-*), not real products or people.

import type { DeckDef } from '../../kit'
import { MarkerClose, MarkerFacts, MarkerIntro, MarkerLog, MarkerSkills, MarkerWorks } from '../../kit'
import books from './assets/decor-books.webp'
import lamp from './assets/decor-lamp.webp'
import note from './assets/decor-note.webp'
import phone from './assets/decor-phone.webp'
import reader from './assets/decor-reader.webp'
import timer from './assets/decor-timer.webp'

const img = (src: string, alt: string) => ({ src, alt })
const corners = { left: '回头见 — 打个招呼', city: '杭州', zone: 'Asia/Shanghai' }

export const deck: DeckDef = {
  title: '记号笔 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'marker',
  theme: 'emerald',
  slides: [
    {
      id: 'intro',
      label: '开场',
      render: () => (
        <MarkerIntro
          say={'我是 周拾，一个做 ==安静的界面==\n和 ==小工具== 的设计师。'}
          aside={'说个秘密？我收集\n==没用过的速写本==。'}
          links={['精选作品', '我做什么', '现在']}
          corners={corners}
        />
      ),
    },
    {
      id: 'works',
      label: '作品',
      render: () => (
        <MarkerWorks
          hint="点左下角箭头翻页"
          kicker="精选作品"
          works={[
            { name: '港口笔记', no: '001', year: '2024', image: img(phone, '奶油色卡片前立着一部纸质感的白色手机样机') },
            { name: '信号灯', no: '002', year: '2023', image: img(lamp, '两块橡木板夹着暖光的小台灯') },
            { name: '田野手册', no: '003', year: '2022', image: img(note, '浅灰陶瓷封面的口袋笔记本和一支铅笔') },
            { name: '慢计时', no: '004', year: '2022', image: img(timer, '一只浅灰绿的圆形厨房计时器') },
            { name: '速写本', no: '005', year: '2021', image: img(books, '三本叠在一起的薄速写本，夹着一枚夹子') },
            { name: '静读', no: '006', year: '2021', image: img(reader, '靠在亚麻布上的白色墨水屏阅读器') },
          ]}
          corners={corners}
        />
      ),
    },
    {
      id: 'skills',
      label: '我做什么',
      render: () => (
        <MarkerSkills
          hint="把鼠标移到卡片上"
          kicker="我做什么"
          skills={[
            { name: '界面', no: '001', note: '产品界面', icon: 'screen' },
            { name: '小工具', no: '002', note: '插件与套件', icon: 'blocks' },
            { name: '字体', no: '003', note: '字体样张', icon: 'type' },
          ]}
          nowLabel="现在"
          updated="更新于 2026 年 9 月"
          now={'此刻我在做 ==一个很小的排版工具==，在读 ==《纸上城市》==，\n顺便填满第 7 本速写本。'}
          corners={corners}
        />
      ),
    },
    {
      id: 'facts',
      label: '数字',
      render: () => (
        <MarkerFacts
          say={'八年里，我画过 ==很多界面==，\n也删掉了 ==更多==。'}
          facts={[
            { value: 42, label: '上线的界面' },
            { value: 9, label: '开源的小工具' },
            { value: 1280, unit: '+', label: '画满的速写页' },
            { value: 7, unit: '本', label: '用完的速写本' },
          ]}
          note="数字截至 2026 年 9 月 · 示意"
          corners={corners}
        />
      ),
    },
    {
      id: 'log',
      label: '随笔',
      render: () => (
        <MarkerLog
          hint="点一行展开"
          kicker="随笔"
          meta="每月一两篇"
          entries={[
            { date: '09.18', title: '为什么我只用 ==两种字重==', tag: '排版', body: '一种给正文，一种给标题。少一个选择，就少一次犹豫，页面也更安静。' },
            { date: '08.02', title: '给小工具写 ==一页说明书==', tag: '工具', body: '如果说明书超过一页，通常是工具本身该改了。' },
            { date: '06.27', title: '速写本里的 ==三十个按钮==', tag: '草图' },
            { date: '05.11', title: '把设置页 ==删到只剩三项==', tag: '界面' },
          ]}
          corners={corners}
        />
      ),
    },
    {
      id: 'close',
      label: '收尾',
      render: () => (
        <MarkerClose
          hint="点邮箱可以复制"
          say={'有个 ==安静的想法==？\n写信给我。'}
          mail="hi@zhoushi.example"
          links={['即刻', '小红书', 'GitHub', '简历']}
          corners={{ city: '杭州', zone: 'Asia/Shanghai' }}
        />
      ),
    },
  ],
}
