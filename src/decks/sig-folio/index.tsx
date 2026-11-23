// Signature templates for the `folio` style. 林屿 is a made-up product designer and
// every client, figure and price is illustrative. All pictures are AI-generated
// decorative illustrations (decor-*), not real work, clients or people.

import type { DeckDef } from '../../kit'
import { FolioCase, FolioContact, FolioHero, FolioOffers, FolioSteps, FolioWords } from '../../kit'
import cam from './assets/decor-cam.webp'
import client from './assets/decor-client.webp'
import lamp from './assets/decor-lamp.webp'
import me from './assets/decor-me.webp'
import ring from './assets/decor-ring.webp'
import silk from './assets/decor-silk.webp'
import sketch from './assets/decor-sketch.webp'
import slab from './assets/decor-slab.webp'

const img = (src: string, alt: string, focus?: string) => ({ src, alt, focus })

const CAM = img(cam, '一台透明外壳的拍立得相机，零件悬浮展开')
const SLAB = img(slab, '盐湖上立着一块发光的琥珀色玻璃板', '40% 50%')
const LAMP = img(lamp, '一盏磨砂亚克力灯罩的细臂台灯')
const RING = img(ring, '墙上一个玻璃面的圆形温控器，一只手正伸过去')
const SILK = img(silk, '流动的彩虹色丝绸')
const SKETCH = img(sketch, '桌上的设备草图、白色打印样件和色卡')

export const deck: DeckDef = {
  title: '作品轨 · 专属版式',
  iconStyle: 'line-duotone',
  style: 'folio',
  theme: 'violet',
  slides: [
    {
      id: 'hero',
      label: '开场',
      render: () => (
        <FolioHero
          hint="点右边的刻度换一张作品"
          status="接受新项目 · 12 月起"
          person={{
            avatar: img(me, '林屿的头像'),
            name: '林屿',
            note: 'hello@linyu.example',
          }}
          pre="你的下一位"
          title="产品设计师"
          lead="我做数字产品、网站和硬件界面，专注可用、清楚、真的被人用起来。好看是底线，顺手才是目的。"
          ctas={['聊聊项目', '看更多作品']}
          tags={['交互设计', '线框原型', '可用性测试', '工业外观']}
          link="查看报价"
          frames={[
            { image: CAM, tag: '01', caption: '透明相机 · 外观与交互' },
            { image: SLAB, tag: '02', caption: '琥珀 · 灯光即状态' },
            { image: LAMP, tag: '03', caption: '薄光台灯 · 量产' },
          ]}
        />
      ),
    },
    {
      id: 'case',
      label: '案例',
      render: () => (
        <FolioCase
          kicker="CASE 02 / 04 · 2026"
          title="琥珀"
          sub="一块会发光的路由器"
          meta={[
            { label: '客户', value: '远山网络' },
            { label: '我的角色', value: '外观设计、配网流程、App 首屏' },
            { label: '周期', value: '14 周，3 轮用户测试' },
          ]}
          stats={[
            { value: '3', unit: '×', label: '配网成功率提升' },
            { value: '48', unit: 's', label: '开箱到联网' },
            { value: '4.8', label: '应用商店评分' },
          ]}
          link="看完整案例 →"
          frames={[
            { image: CAM, tag: '01', caption: '透明相机' },
            { image: SLAB, tag: '02', caption: '琥珀 · 灯光即状态' },
            { image: SILK, tag: '03', caption: '丝光 · 材质研究' },
          ]}
          focus={1}
          source="示意项目与数据"
        />
      ),
    },
    {
      id: 'steps',
      label: '做法',
      render: () => (
        <FolioSteps
          hint="点一步，右边跟着换图"
          kicker="PROCESS · 6–14 周"
          title="四步做完"
          sub="每一步都有东西交"
          steps={[
            {
              name: '现场观察',
              time: '第 1 周',
              body: '跟着用户开箱、配网、出错各一遍，把卡住的地方全拍下来。',
              image: SKETCH,
              caption: '草图与打样',
            },
            {
              name: '草图打样',
              time: '第 2–4 周',
              body: '手绘加 3D 打印，一周三版，摸得到再谈好不好看。',
              image: LAMP,
              caption: '样件 · 第 7 版',
            },
            {
              name: '交互原型',
              time: '第 5–8 周',
              body: '可点原型进测试，每轮 6 个人，改到没人卡住为止。',
              image: RING,
              caption: '温控 · 原型',
            },
            {
              name: '量产陪跑',
              time: '第 9 周起',
              body: '跟工厂对色、对公差，首批出货前再验一次。',
              image: SLAB,
              caption: '琥珀 · 首批',
            },
          ]}
        />
      ),
    },
    {
      id: 'words',
      label: '评价',
      render: () => (
        <FolioWords
          hint="点箭头换一条"
          kicker="客户怎么说 · 2024—2026"
          words={[
            {
              text: '他会先把问题问到我们自己都答不上来，然后给出一个让工厂和用户都满意的方案。',
              name: '许棠',
              role: '产品负责人 · 远山网络',
              avatar: img(client, '许棠的头像'),
              metric: { value: '3×', label: '配网成功率' },
              image: SLAB,
              caption: '琥珀 · 路由器',
            },
            {
              text: '六周交了外观、App 首屏和官网，节奏比我们内部团队还稳。',
              name: '高原',
              role: '创始人 · 薄光照明',
              metric: { value: '6 周', label: '从草图到量产图' },
              image: LAMP,
              caption: '薄光台灯',
            },
            {
              text: '原型测试那几轮，我们第一次看清用户到底卡在哪一步。',
              name: '沈一',
              role: '设计总监 · 栖居智能',
              metric: { value: '−41%', label: '安装求助电话' },
              image: RING,
              caption: '温控器 · 交互',
            },
          ]}
          source="示意评价与数据"
        />
      ),
    },
    {
      id: 'offers',
      label: '服务',
      render: () => (
        <FolioOffers
          hint="点一种合作方式试试"
          kicker="SERVICES · 2026"
          title="三种合作方式"
          sub="按你的阶段挑"
          offers={[
            {
              name: '设计冲刺',
              note: '一周，一个关键流程，从调研到可点原型',
              price: '¥28k',
            },
            {
              name: '产品首发',
              note: '六周，外观、App 首屏与官网一次做齐',
              price: '¥120k',
            },
            {
              name: '长期合伙',
              note: '每月固定档期，随叫随改',
              price: '¥36k',
              unit: '/ 月',
            },
          ]}
          slot={{
            label: '05 / 05 · 档期开放',
            title: '你的项目，放这里',
            note: '这一格空太久，有点可惜。',
            cta: '一起做点什么',
          }}
          frames={[{ image: SILK }]}
          foot="© 2026 林屿 · 杭州 / 远程"
          source="示意价格"
        />
      ),
    },
    {
      id: 'contact',
      label: '问答',
      render: () => (
        <FolioContact
          hint="点问题展开，点时间预约"
          kicker="FAQ · 常见问题"
          title="开始之前"
          sub="你可能想问"
          faqs={[
            {
              q: '只做外观，不做 App 可以吗？',
              a: '可以。但我会建议至少一起看一遍配网和首屏，硬件的第一印象常常坏在那里。',
            },
            {
              q: '远程怎么合作？',
              a: '每周两次视频评审，样件寄到你手上；关键节点我会到现场。',
            },
            {
              q: '多久能开始？',
              a: '目前 12 月起有档期，冲刺类项目最快下周就能排进来。',
            },
            {
              q: '报价包括打样费吗？',
              a: '包括 3 次以内的 3D 打印；CNC 和开模按实际费用另算。',
            },
          ]}
          card={{
            avatar: img(me, '林屿的头像'),
            name: '林屿',
            note: '30 分钟 · 视频沟通',
            status: '可预约',
            day: '12 月 3 日 · 周三',
            slots: ['10:00', '11:30', '14:00', '15:30', '17:00', '19:00'],
            cta: '预约',
            mail: 'hello@linyu.example',
          }}
          frames={[{ image: CAM }, { image: SKETCH }]}
          foot="© 2026 林屿 · 杭州 / 远程"
        />
      ),
    },
  ],
}
