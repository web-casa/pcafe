// Signature templates for the `album` style. 拾光 is a made-up private photo-album app;
// every person, figure and price is illustrative. All pictures are AI-generated
// decorative illustrations (decor-*), not real photos of real people.

import type { DeckDef } from '../../kit'
import { AlbumClose, AlbumHero, AlbumLayout, AlbumPlus, AlbumStories, AlbumWeek } from '../../kit'
import camera from './assets/decor-camera.webp'
import grass from './assets/decor-grass.webp'
import kitchen from './assets/decor-kitchen.webp'
import rooftop from './assets/decor-rooftop.webp'
import scarf from './assets/decor-scarf.webp'
import street from './assets/decor-street.webp'
import sunset from './assets/decor-sunset.webp'
import windowImg from './assets/decor-window.webp'

const img = (src: string, alt: string, focus?: string) => ({ src, alt, focus })
const WINDOW = img(windowImg, '午后的阳光从木窗照进屋里')
const ROOF = img(rooftop, '天台上穿红裙的女人', '50% 30%')
const SUNSET = img(sunset, '海边的日落', '50% 70%')
const KITCHEN = img(kitchen, '外婆的厨房，灶上冒着热气')
const STREET = img(street, '老城窄街上晾着衣服')
const GRASS = img(grass, '孩子光脚跑过金色草地', '50% 40%')
const CAMERA = img(camera, '桌上的旧胶片相机和一叠洗好的照片')
const SCARF = img(scarf, '戴橙色头巾的女孩在笑', '50% 30%')

export const deck: DeckDef = {
  title: '相册 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'album',
  theme: 'violet',
  slides: [
    {
      id: 'hero',
      label: '开场',
      render: () => (
        <AlbumHero
          hint="把鼠标移到照片上"
          badge="私密内测中"
          hand="给那些拍了，却从没洗出来的照片"
          title={['有些时刻，值得', '被好好记住。']}
          grad="记住。"
          lead="一个安静的私密相册：把相机胶卷变成一卷卷小故事，只分享给你选的人。"
          cta="开始记录"
          prints={[
            { image: STREET, caption: '老城清晨' },
            { image: WINDOW, caption: '午后的窗' },
            { image: KITCHEN, caption: '外婆的厨房' },
            { image: GRASS, caption: '第 32 周' },
            { image: ROOF, caption: '天台 · 六月' },
            { image: SCARF, caption: '市集那天' },
            { image: SUNSET, caption: '海边日落' },
            { image: CAMERA, caption: '洗出来了' },
          ]}
          chips={['✦ 本周 +42 张', '◎ 1,284 张照片', '与 3 位家人共享']}
        />
      ),
    },
    {
      id: 'layout',
      label: '排一排',
      render: () => (
        <AlbumLayout
          hint="点左边的步骤，看照片怎么摆"
          title={['亲手排一排，', '才像自己的相册。']}
          em="排一排"
          steps={[
            { name: '放进一卷', note: '选一周，那一周的照片会落在桌面上，一张一张来。' },
            { name: '决定大小', note: '重要的放大，顺带拍到的缩小。' },
            { name: '摆到它该在的位置', note: '拖动就好，像在桌上摆照片。' },
          ]}
          photos={[WINDOW, KITCHEN, SUNSET, GRASS, SCARF]}
          loose={[ROOF, STREET]}
        />
      ),
    },
    {
      id: 'week',
      label: '这一周',
      render: () => (
        <AlbumWeek
          hint="点一张照片"
          kicker="第 24 周 · 六月"
          title="这一周，一天一张"
          picked={3}
          days={[
            { day: '周一', date: '6 月 10 日', image: STREET, caption: '早班车', note: '比闹钟先醒，干脆出门走了一圈，老街还没开张。', place: '老城区' },
            { day: '周二', date: '6 月 11 日', image: WINDOW, caption: '午后', note: '阳光正好落在桌上那本没读完的书上。', place: '家' },
            { day: '周三', date: '6 月 12 日', image: KITCHEN, caption: '外婆家', note: '外婆说汤要煮到第三个小时才算好，我们就等着。', place: '外婆家' },
            { day: '周四', date: '6 月 13 日', image: GRASS, caption: '第 32 周', note: '他第一次光着脚跑过整片草地，没有回头看我。', place: '城西公园' },
            { day: '周五', date: '6 月 14 日', image: SCARF, caption: '市集', note: '朋友换了新头巾，笑得比镜头快。', place: '周末市集' },
            { day: '周六', date: '6 月 15 日', image: ROOF, caption: '天台', note: '风很大，裙子和云一起往东边飘。', place: '天台' },
            { day: '周日', date: '6 月 16 日', image: SUNSET, caption: '日落', note: '这一周的最后一张，留给海。', place: '东海岸' },
          ]}
        />
      ),
    },
    {
      id: 'stories',
      label: '他们的相册',
      render: () => (
        <AlbumStories
          hint="点照片翻到背面"
          kicker="他们的相册"
          title="照片背后，写着一句话"
          stories={[
            { image: KITCHEN, caption: '外婆的厨房', note: '外婆不会用手机，但每周日都等着我把这一周印出来给她看。', name: '小满', meta: '用了 2 年' },
            { image: GRASS, caption: '第 32 周', note: '从他出生那周开始，一周一卷。以后交给他自己。', name: '阿乔', meta: '每周一卷' },
            { image: SUNSET, caption: '海边日落', note: '异地的那一年，我们靠共享相册知道对方今天看见了什么。', name: '林夏', meta: '两人共享' },
          ]}
          source="示意用户故事"
        />
      ),
    },
    {
      id: 'plus',
      label: 'Plus',
      render: () => (
        <AlbumPlus
          hint="切换月付和年付"
          name="拾光 Plus"
          lead="Plus 让拾光保持独立、没有广告。原图存更多、换更多方式珍藏，新功能也最先给你。"
          feats={[
            { icon: '☁', title: '原图不限量', note: '不压缩、不降画质，一辈子的照片原样存好。' },
            { icon: '⌂', title: '家庭共享相册', note: '全家一起往里添，同一天的不同角度落在一处。' },
            { icon: '▤', title: '冲印成册', note: '任意一周印成小册子，寄到你家门口。' },
            { icon: '✦', title: '抢先体验', note: '新功能先给你试，告诉我们下一个做什么。' },
          ]}
          prices={['¥18', '¥168']}
          cta="加入 Plus"
          around={[CAMERA, SUNSET, SCARF, GRASS]}
          source="示意价格"
        />
      ),
    },
    {
      id: 'close',
      label: '收尾',
      render: () => (
        <AlbumClose
          hint="点右边那叠照片"
          hand="今天拍的，今天就放进去"
          title={['把这一周，', '留给以后的你。']}
          grad="以后的你。"
          lead="免费开始，存满 500 张再决定要不要 Plus。照片只属于你，随时可以整卷导出。"
          ctas={['开始记录', '先看看示例相册']}
          note="iOS、安卓和网页都能用 · 内测期间免费"
          prints={[
            { image: CAMERA, caption: '洗出来了' },
            { image: SCARF, caption: '市集那天' },
            { image: WINDOW, caption: '午后的窗' },
            { image: ROOF, caption: '天台 · 六月' },
            { image: STREET, caption: '老城清晨' },
          ]}
        />
      ),
    },
  ],
}
