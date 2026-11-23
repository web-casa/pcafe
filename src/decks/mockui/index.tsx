import type { DeckDef } from '../../kit'
import { AppCards, ChatDemo, DirectChat, SocialFeed, SocialPost } from '../../kit'
import type { SocialMenuItem } from '../../kit'
import ad from './assets/decor-ad.webp'
import carwash from './assets/decor-carwash.webp'
import desk from './assets/decor-desk.webp'
import dinner from './assets/decor-dinner.webp'
import faceA from './assets/decor-face-a.webp'
import faceB from './assets/decor-face-b.webp'
import faceC from './assets/decor-face-c.webp'
import me from './assets/decor-me.webp'
import river from './assets/decor-river.webp'

// 许知夏, 夏至 AI and every number, comment and price on the social slides are made up;
// all pictures are AI-generated decorative illustrations (decor-*), not real people.
const img = (src: string, alt: string, focus?: string) => ({ src, alt, focus })
const ME = { name: '许知夏', role: '设计 · 独立开发', avatar: img(me, '许知夏的头像（AI 生成）') }
const MENU: SocialMenuItem[] = [
  { icon: 'home', label: '首页' },
  { icon: 'search', label: '搜索' },
  { icon: 'bell', label: '动态通知' },
  { icon: 'document', label: '文章' },
  { icon: 'shop', label: '小铺' },
  { icon: 'user', label: '关于我' },
]
const FAKE = '示意界面：人物、产品、数字与评论均为虚构。'

export const deck: DeckDef = {
  title: '拟真界面 · 五个模板',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'standard',
  slides: [
    {
      id: 'chat',
      label: '对话演示',
      build: 'reveal',
      render: () => (
        <ChatDemo
          kicker="对话演示"
          title={['一句话，', '换一份演示']}
          lead="用一段示意对话展示怎么用，比列功能清楚。每按一次 → 出现一条消息。"
          notes={['窗口上标着「示意界面」', '结果卡片写清楚改了什么']}
          app="写作助手"
          messages={[
            { from: 'user', text: '把这份季度复盘做成 12 页左右的演示。' },
            { from: 'bot', text: '先列故事线：现状、三个发现、下季度计划。' },
            { from: 'user', text: '第二个发现的数字要有出处。' },
            {
              from: 'bot',
              text: '已改用带出处的模板，检查通过。',
              card: {
                title: 'check 结果',
                rows: [
                  ['页数', '12'],
                  ['问题', '0'],
                ],
              },
            },
          ]}
          source="示意界面：展示对话的形状，不是真实记录"
        />
      ),
    },
    {
      id: 'apps',
      label: '后台卡片',
      build: 'reveal',
      render: () => (
        <AppCards
          kicker="三种出口"
          title="同一份内容，三种文件"
          lead="把要说明的东西直接填进界面里，读者一眼看到结果。"
          cards={[
            {
              app: '放映',
              title: '单个 HTML 文件',
              fields: [
                { label: '打开方式', value: '浏览器，离线' },
                { label: '演讲者视图', value: '按 S' },
                { label: '阅读视图', value: '#/read' },
              ],
              tags: ['默认'],
              status: { text: '可用' },
            },
            {
              app: '导出',
              title: 'PDF',
              fields: [
                { label: '打开', value: '#/print' },
                { label: '适合', value: '会后分发' },
                { label: '逐条展开', value: '全部显示' },
              ],
              tags: ['A4', '16:9'],
              status: { text: '可用' },
            },
            {
              app: '导出',
              title: 'PPTX',
              fields: [
                { label: '命令', value: 'pcafe pptx' },
                { label: '文字', value: '可编辑' },
                { label: '备注', value: '写进 PPT 备注' },
              ],
              tags: ['PowerPoint'],
              status: { text: '新', tone: 'wait' },
            },
          ]}
          source="示意界面；命令见 docs/zh-CN/presenting.md"
        />
      ),
    },
    {
      id: 'feed',
      label: '动态流',
      render: () => (
        <SocialFeed
          hint="点 ♡ 点赞；点右上的圆形头像会标为已看"
          profile={ME}
          menu={MENU}
          active={0}
          clock={{ city: '上海', time: '00:48', date: ['11 月', '08'] }}
          posts={[
            {
              text: '又出发了。这次带了一台笔记本和一个还没想好名字的 App。',
              time: '9 个月前',
              pinned: true,
              media: [img(river, '夜晚江边的高楼和两杯咖啡（AI 生成）'), img(carwash, '洗车时挡风玻璃上的粉色泡沫（AI 生成）')],
              likes: '2.3k',
            },
            { text: '给一家果茶店拍了支广告，戴着耳机演了一整天 :)', time: '7 个月前', likes: '864' },
            { text: 'App 的名字定了，叫「夏至」。下个月见。', time: '8 个月前', likes: '1.1k' },
          ]}
          stories={[
            { label: '作品', image: img(desk, '深夜书桌上的电脑和手机（AI 生成）') },
            { label: '城市', image: img(river, '夜晚江边（AI 生成）') },
            { label: '做饭', image: img(dinner, '一盘麻婆豆腐和米饭（AI 生成）') },
            { label: '工作', image: img(ad, '戴耳机的女生（AI 生成）', '50% 25%') },
          ]}
          boxes={[
            {
              title: '文章',
              items: [
                { title: '我把「夏至 AI」卖了…', note: '本来没打算卖的', image: img(desk, '书桌上的电脑（AI 生成）') },
                { title: '我去拍了个广告', note: '本来也没打算演', image: img(ad, '戴耳机的女生（AI 生成）', '50% 25%') },
              ],
            },
            {
              title: '动态通知',
              items: [
                { title: '开始了一个新项目', note: '9 个月前', icon: 'rocket' },
                { title: '出门旅行中', note: '10 个月前', icon: 'map' },
              ],
            },
          ]}
          say="喜欢我的作品的话，最近正好在看新机会 👋"
          source={FAKE}
        />
      ),
    },
    {
      id: 'post',
      label: '发布帖',
      render: () => (
        <SocialPost
          hint="点 ♡ 点赞"
          profile={ME}
          menu={MENU}
          active={3}
          clock={{ city: '上海', time: '21:16', date: ['11 月', '08'] }}
          time="去年"
          text={['夏至 AI 上线了。一个人做了 11 个月，', '今天卖出第 4 单，我在便利店门口哭了一会儿。']}
          image={img(desk, '深夜书桌上的笔记本电脑和显示薄荷绿 App 的手机（AI 生成）')}
          counts={['12.8k', '932']}
          facts={{
            title: '这次上线',
            items: [
              { icon: 'clock', value: '11 个月', note: '一个人从零做完' },
              { icon: 'users', value: '4,120 位', note: '首周注册' },
              { icon: 'money', value: '¥6.2 万', note: '首月收入' },
            ],
          }}
          comments={{
            title: '热门评论',
            items: [
              { name: '阿柚', text: '界面太舒服了，已经推给全组。', avatar: img(faceB, '编发戴大耳环的女生（AI 生成）', '50% 25%') },
              { name: '程远', text: '求一篇怎么做冷启动的长文！', avatar: img(faceC, '戴圆眼镜的男士（AI 生成）', '50% 30%') },
              { name: 'Neo', text: '便利店门口那段太真实了', avatar: img(faceA, '漂白头发戴圆眼镜的男生（AI 生成）', '50% 25%') },
            ],
          }}
          source={FAKE}
        />
      ),
    },
    {
      id: 'dm',
      label: '私信',
      render: () => (
        <DirectChat
          hint="点下面的快捷回复，会收到回答"
          profile={ME}
          menu={[...MENU.slice(0, 2), { icon: 'chat', label: '聊两句' }, ...MENU.slice(3)]}
          active={2}
          clock={{ city: '上海', time: '10:02', date: ['11 月', '09'] }}
          messages={[
            { from: 'you', text: '你好！看了你的夏至 AI，我们团队在做一个记账 App，想请你帮忙看看首屏。' },
            { from: 'me', text: '好呀！我最近正好有档期。可以先发我现在的版本和最想解决的问题吗？' },
            { from: 'you', text: '太好了，下午发你。顺便问下，你接长期合作吗？' },
            { from: 'me', text: '接的，每月固定两周档期。我们约个 20 分钟聊聊 👋' },
          ]}
          offer={{ after: 1, image: img(desk, '书桌上的电脑和手机（AI 生成）'), title: '首屏诊断 · 一周', note: '体验走查、改版建议、可点原型', price: '¥12,000 起' }}
          quick={[
            { label: '约个时间', reply: '这周四下午 3 点或周五上午 10 点都可以，你挑一个？' },
            { label: '发作品集', reply: '发你啦：最近三个项目的案例，都带改版前后对比。' },
            { label: '问报价', reply: '首屏诊断一周 ¥12,000 起，长期合作按月算会更划算。' },
          ]}
          source={FAKE}
        />
      ),
    },
  ],
}
