// Components v2 · phase 3 demo: 纸的旅程 — a short history of paper, built on the
// card and prop templates. Facts from Wikipedia (History of paper, Gutenberg Bible,
// Penny Black, ISO 216), 《后汉书·蔡伦传》, 《天工开物》 and US EPA (2018 data).
// Textures are AI-generated decor images, decoration only.

import type { DeckDef } from '../../kit'
import { CardStack, Closing, Cover, DepthCarousel, Envelope, FanCarousel, FlipBook, FlipCards, Lanyard, NotebookCover, ProcessAccordion, ProgressCards } from '../../kit'
import paper from './assets/decor-paper.webp'
import leather from './assets/decor-leather.webp'

export const deck: DeckDef = {
  title: '纸的旅程',
  iconStyle: 'line-duotone',
  theme: 'amber',
  style: 'editorial',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="一堂关于纸的小课"
          title={['纸的旅程']}
          lead="一种用植物纤维做成的薄片，怎样花了一千多年走到欧洲，又怎样变成今天每天都在用的东西。"
          facts={[
            { label: '蔡伦奏上造纸法', value: '105 年', icon: 'history' },
            { label: '第一枚背胶邮票', value: '1840 年', icon: 'letter' },
            { label: '美国纸类回收率', value: '68.2%', icon: 'refresh' },
          ]}
          numeral="105"
          hint="按 → 翻页"
        />
      ),
    },
    {
      id: 'lanyard',
      label: '人物',
      build: 'reveal',
      render: () => (
        <Lanyard
          kicker="今天的向导"
          title={['一位东汉官员，', '和一份奏章']}
          badge={{ event: '纸的旅程 · 人物卡', initials: '蔡', name: '蔡伦', role: '东汉 · 中常侍 · 尚方令', code: 'AD 105' }}
          strap="PAPER ROUTE"
          points={[
            { label: '身份', text: '东汉和帝时任中常侍，后加位尚方令，主管宫中器物制作。' },
            { label: '元兴元年', text: '公元 105 年，把改进后的造纸方法奏报朝廷。' },
            { label: '原料', text: '“用树肤、麻头及敝布、鱼网以为纸”。' },
            { label: '称呼', text: '此后“天下咸称蔡侯纸”。' },
          ]}
          source="《后汉书·宦者列传·蔡伦》"
        />
      ),
    },
    {
      id: 'myths',
      label: '三个误会',
      build: 'reveal',
      render: () => (
        <FlipCards
          kicker="先翻三张牌"
          title="关于纸，常见的三个说法"
          lead="每张牌正面是一句流行说法，翻过来是记载和学者的看法。"
          backTag="其实"
          cards={[
            { tag: '说法一', front: '纸是蔡伦从零发明的', title: '更早就已有纸', body: '考古发现的纸片早于公元 105 年；记载里的 105 年，是蔡伦改进并奏上造纸法。' },
            { tag: '说法二', front: '怛罗斯之战把造纸术带到撒马尔罕', title: '这更像一个传说', body: '这一说法出自 11 世纪史家的记述，研究者 Jonathan Bloom 认为不太可能属实。' },
            { tag: '说法三', front: '欧洲最早的纸坊在意大利', title: '伊比利亚有更早的记录', body: '有记录的伊比利亚第一座纸坊在 1056 年的沙蒂瓦；意大利法布里亚诺的纸坊出现在 13 世纪。' },
          ]}
          source="Wikipedia · History of paper（2026 年查阅）"
        />
      ),
    },
    {
      id: 'ch1',
      label: '第一章',
      render: () => (
        <NotebookCover
          number="01"
          kicker="第一章"
          title={['纸从哪里', '出发']}
          sub="一千四百年，从东到西"
          source="Wikipedia · History of paper（2026 年查阅）"
          items={['从洛阳到托莱多', '古法造纸的五道工序']}
          texture={leather}
        />
      ),
    },
    {
      id: 'route',
      label: '西传路线',
      build: 'reveal',
      render: () => (
        <DepthCarousel
          kicker="西传"
          title="纸走过的五站"
          lead="每按一次，下一站来到最前面。年份是有记录或传说中的最早时间。"
          items={[
            { mark: '105', title: '东汉洛阳', body: '蔡伦把改进的造纸法奏报朝廷，这是史书里的关键年份。' },
            { mark: '751', title: '撒马尔罕', body: '传说怛罗斯之战的战俘带去了造纸术，学界对此存疑。' },
            { mark: '793', title: '巴格达', body: '到 793 年，巴格达已经在造纸；794–795 年有纸坊记录。' },
            { mark: '1056', title: '沙蒂瓦', body: '伊比利亚半岛有记录的第一座纸坊；1085 年托莱多也已造纸。' },
            { mark: '1490', title: '英格兰', body: '约 1490 年，约翰·泰特在赫特福德附近建起英格兰第一座纸坊。' },
          ]}
          source="Wikipedia · History of paper（2026 年查阅）"
        />
      ),
    },
    {
      id: 'craft',
      label: '古法工序',
      build: 'reveal',
      render: () => (
        <ProcessAccordion
          kicker="古法"
          title="竹纸的五道工序"
          lead="明代《天工开物·杀青》用五幅图画出竹纸的做法，按一次展开一道。"
          steps={[
            { title: '斩竹漂塘', sub: '取料', body: '砍下嫩竹，截段后浸在水塘里，让竹料慢慢沤软。' },
            { title: '煮楻足火', sub: '蒸煮', body: '竹料拌上石灰，放进大锅和楻桶里长时间蒸煮，把纤维煮散。' },
            { title: '荡料入帘', sub: '抄纸', body: '把竹帘伸进纸浆槽里一荡，提起时帘上留下一层薄薄的湿纸。' },
            { title: '覆帘压纸', sub: '压榨', body: '把湿纸一张张覆叠成垛，上面加压，挤出水分。' },
            { title: '透火焙干', sub: '烘干', body: '湿纸贴在中间生火的夹墙上烘干，揭下来就是成纸。' },
          ]}
          source="宋应星《天工开物·杀青》，1637 年（工序名称照原书，说明为概述）"
        />
      ),
    },
    {
      id: 'ch2',
      label: '第二章',
      render: () => (
        <NotebookCover
          number="02"
          kicker="第二章"
          title={['纸上承载', '了什么']}
          sub="一本书、一封信、一台机器"
          items={['一部印在纸上的圣经', '一枚一便士的邮票', '一条不停转的造纸机']}
          texture={leather}
        />
      ),
    },
    {
      id: 'bible',
      label: '古腾堡圣经',
      build: 'reveal',
      render: () => (
        <FlipBook
          kicker="一本书"
          title="翻开古腾堡圣经"
          lead="欧洲第一部用金属活字大量印刷的书。按一次翻一页。"
          texture={paper}
          spreads={[
            {
              left: { label: '完成', value: '1455', title: '约 1454–1455 年印成', body: '已知最早有日期题记的一部，写于 1456 年 8 月 15 日。' },
              right: { label: '版面', value: '42', title: '每页 42 行', body: '所以又叫“四十二行圣经”；最先印的几页只有 40 行。' },
            },
            {
              left: { label: '印数', value: '≈180', title: '约印了 160–185 部', body: '1455 年的一封信里提到的数字是 158 或 180 部。' },
              right: { label: '材料', value: '3/4', title: '约四分之三印在纸上', body: '其余印在犊皮纸上。纸让书的成本降了下来。' },
            },
            {
              left: { label: '现存', value: '49', title: '已知现存 49 部', body: '另有约 16 部只剩残页。' },
              right: { label: '完整本', value: '21–25', title: '完整的约 21–25 部', body: '不同统计口径给出的完整本数量不同。' },
            },
          ]}
          source="Wikipedia · Gutenberg Bible（2026 年查阅）"
        />
      ),
    },
    {
      id: 'stamp',
      label: '黑便士',
      build: 'reveal',
      render: () => (
        <Envelope
          kicker="一封信"
          title={['一枚邮票，', '让信变便宜']}
          lead="1840 年 5 月 1 日，英国发行黑便士，第一枚背面带胶的邮票，共印了 68,808,000 枚。"
          greeting="致每一位寄信人："
          body="自 1840 年 5 月 6 日起，半盎司（约 14 克）以内的信件，无论寄往多远，一律只收 1 便士。"
          sign="示意信件 · 据史实改写"
          stamp="1d"
          texture={paper}
          source="Wikipedia · Penny Black（2026 年查阅）"
        />
      ),
    },
    {
      id: 'machine',
      label: '机器造纸',
      build: 'reveal',
      render: () => (
        <CardStack
          kicker="一台机器"
          title="纸从一张张抄，到一整卷流出来"
          lead="四个年份，把手工抄纸变成了连续的工业生产。"
          cards={[
            { mark: '1799', title: '连续造纸机', body: '法国人罗贝尔获得连续造纸机的专利。' },
            { mark: '1801', title: '英国专利', body: '10 月 20 日，甘布尔在英国取得 2487 号专利。' },
            { mark: '1803', title: '装机投产', body: '1803–1804 年，机器装进英格兰的弗罗格莫尔纸坊。' },
            { mark: '1843', title: '木浆登场', body: '木浆开始取代回收的破布，造纸不再受破布供应限制。' },
          ]}
          source="Wikipedia · History of paper（2026 年查阅）"
        />
      ),
    },
    {
      id: 'ch3',
      label: '第三章',
      render: () => (
        <NotebookCover
          number="03"
          kicker="第三章"
          title={['今天的', '一张纸']}
          sub="尺寸有标准，用完能回收"
          items={['A4 为什么是这个比例', '纸被回收了多少']}
          texture={leather}
        />
      ),
    },
    {
      id: 'a4',
      label: 'A 系列纸',
      build: 'reveal',
      render: () => (
        <FanCarousel
          kicker="尺寸"
          title="一张 A4 背后的五个数字"
          lead="A 系列纸对折后比例不变，所以 A0 一路对折就得到 A1、A2……A4。"
          cards={[
            { icon: 'letter', mark: '1786', title: '最早的设想', body: '利希滕贝格在 1786 年 10 月 25 日的信里提到这种比例。' },
            { icon: 'diagram', mark: '√2', title: '长宽比', body: '长边约是短边的 1.414 倍，对折后比例不变。' },
            { icon: 'layers', mark: '1 m²', title: 'A0 的面积', body: 'A0 按面积 1 平方米定义，再按比例取整到毫米。' },
            { icon: 'document', mark: 'A4', title: '210 × 297 mm', body: '面积几乎正好是 1/16 平方米。' },
            { icon: 'global', mark: '1975', title: '成为国际标准', body: 'ISO 216 在 1975 年发布，成为国际通用的纸张尺寸。' },
          ]}
          source="Wikipedia · ISO 216（2026 年查阅）"
        />
      ),
    },
    {
      id: 'recycle',
      label: '回收',
      build: 'reveal',
      render: () => (
        <ProgressCards
          kicker="回收"
          title="美国的纸，回收了多少"
          lead="2018 年美国四类纸的回收率，按一次看一项。"
          cards={[
            { label: '纸和纸板总体', value: 68.2, note: '纸和纸板整体的回收率。' },
            { label: '瓦楞纸箱', value: 96.5, note: '快递和运输用的纸箱，几乎都被回收。' },
            { label: '报纸', value: 64.8, note: '报纸的回收率略低于整体水平。' },
            { label: '其他纸包装', value: 20.8, note: '瓦楞纸箱以外的纸质容器和包装，回收率最低。' },
          ]}
          source="US EPA · Paper and Paperboard: Material-Specific Data（2018 年数据）"
        />
      ),
    },
    {
      id: 'close',
      label: '结尾',
      render: () => (
        <Closing
          kicker="最后"
          mark="105"
          statement="一张纸，走了近两千年"
          follow="下次拿起一张 A4，想想它的来路。"
          takeaways={[
            '纸在蔡伦之前就已出现；105 年是史书记下改进造纸法的年份。',
            '纸用了一千多年才从东亚传到欧洲，有记录的伊比利亚纸坊始于 1056 年。',
            '机器和木浆让纸变得便宜，今天美国约 68% 的纸和纸板被回收。',
          ]}
          refs={['《后汉书·蔡伦传》', 'en.wikipedia.org/wiki/History_of_paper', 'en.wikipedia.org/wiki/Gutenberg_Bible', 'epa.gov 纸与纸板数据（2018）']}
        />
      ),
    },
  ],
}
