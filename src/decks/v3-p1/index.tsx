// Components v3 · phase 1 demo: 认识 Fedora Linux — what it is, its editions and
// variants, release cadence, its place upstream of CentOS Stream / RHEL, and how to
// start. Facts from fedoraproject.org (2026), Fedora Project Wiki change pages,
// Wikipedia “Fedora Linux” (2026), Fedora Magazine and LWN. Status as of 2026-10-30:
// Fedora 44 is the current release; Fedora 45 Final has slipped to a 3 Nov target.
// The hero image is an AI-generated decor illustration, decoration only.

import type { DeckDef } from '../../kit'
import {
  BadgeHero,
  CtaBlock,
  EditionPicker,
  FaqAccordion,
  FilterChips,
  FooterClosing,
  MegaMenu,
  Milestones,
  NumberedColumns,
  PathCrumbs,
  ReleaseTrain,
  StatRow,
  TabPanels,
} from '../../kit'
import hero from './assets/decor-hero.webp'

const WIKI = 'Wikipedia · Fedora Linux（2026 年查阅）'
const SITE = 'fedoraproject.org（2026-10 查阅）'

export const deck: DeckDef = {
  title: '认识 Fedora Linux',
  iconStyle: 'line-duotone',
  theme: 'cobalt',
  style: 'standard',
  slides: [
    {
      id: 'hero',
      label: '封面',
      render: () => (
        <BadgeHero
          kicker="介绍"
          badge="当前稳定版 · Fedora Linux 44"
          title="认识 Fedora Linux"
          lead="由 Fedora 项目社区开发的 Linux 发行版：它有哪些版本、多久发一版、和 RHEL 是什么关系，以及怎样开始用。"
          actions={[{ label: '从这里开始' }, { label: 'fedoraproject.org', kind: 'ghost' }]}
          note="资料截至 2026 年 10 月 30 日"
          image={{ src: hero, alt: '蓝色半透明玻璃面板与圆角几何形状的抽象插图', credit: '插图：AI 生成（装饰）' }}
          hint="按 → 翻页"
        />
      ),
    },
    {
      id: 'history',
      label: '来历',
      render: () => (
        <Milestones
          kicker="来历"
          title="从 Red Hat Linux 的延续开始"
          lead="Fedora 的名字来自一个为 Red Hat Linux 提供额外软件的志愿者项目，2003 年与 Red Hat Linux 合并。"
          events={[
            { date: '2002', title: 'Warren Togami 在夏威夷大学发起 Fedora Linux', tag: '起点' },
            { date: '2003-11', title: 'Fedora Core 1 发布', tag: '首个版本', focus: true },
            { date: 'Fedora 7', title: '名称去掉 Core，改称 Fedora', tag: '更名' },
            { date: '2014-12', title: 'Fedora 21 起分为三个版本', tag: '版本划分' },
            { date: '2022-11', title: 'Fedora 37 起增加到五个版本', tag: '版本划分' },
            { date: '2026-04-28', title: 'Fedora Linux 44 发布', tag: '当前版本' },
          ]}
          source={WIKI}
        />
      ),
    },
    {
      id: 'foundations',
      label: '价值观',
      build: 'reveal',
      render: () => (
        <NumberedColumns
          kicker="四个基础"
          title="社区写下的四个价值观"
          lead="Fedora 把它们叫作 Four Foundations：Freedom、Friends、Features、First。"
          items={[
            { tag: 'Freedom', title: '自由', body: '坚持自由开源软件，并且让任何人都能整体或部分复制这个项目。', icon: 'key' },
            { tag: 'Friends', title: '朋友', body: '成员意见不同时，仍然朝着大家能接受的共识一起推进。', icon: 'users' },
            { tag: 'Features', title: '功能', body: '追求优秀的软件，开发过程公开进行，任何人都可以参与。', icon: 'widget' },
            { tag: 'First', title: '率先', body: '致力于创新，希望先一步交付接下来会出现的技术。', icon: 'rocket' },
          ]}
          source="Fedora Docs · Fedora’s Mission and Foundations（2026 年查阅）"
        />
      ),
    },
    {
      id: 'family',
      label: '版本家族',
      build: 'reveal',
      render: () => (
        <MegaMenu
          kicker="版本家族"
          title="官网把 Fedora 分成四类下载"
          lead="正式版本之外，还有原子桌面、桌面环境 Spins 和按主题打包的 Labs。"
          brand="Fedora"
          menu={['Editions', 'Atomic', 'Spins', 'Labs']}
          columns={[
            {
              heading: 'Editions',
              icon: 'monitor',
              items: [
                { name: 'Workstation', desc: 'GNOME 桌面' },
                { name: 'KDE Plasma', desc: 'Plasma 桌面' },
                { name: 'Server · Cloud', desc: '服务器与云镜像' },
                { name: 'CoreOS · IoT', desc: '容器与物联网' },
              ],
            },
            {
              heading: 'Atomic 桌面',
              icon: 'layers',
              items: [
                { name: 'Silverblue', desc: '基于 GNOME' },
                { name: 'Kinoite', desc: '基于 KDE Plasma' },
                { name: 'Sway Atomic', desc: '基于 Sway' },
                { name: 'Budgie · COSMIC', desc: '另两种原子桌面' },
              ],
            },
            {
              heading: 'Spins',
              icon: 'window',
              items: [
                { name: 'Xfce', desc: '完整、整合良好的桌面' },
                { name: 'Cinnamon', desc: '传统 GNOME 式体验' },
                { name: 'i3 · Sway', desc: '平铺窗口管理器' },
                { name: '另有 9 种', desc: '共 12 种 Spins' },
              ],
            },
            {
              heading: 'Labs',
              icon: 'academic',
              items: [
                { name: 'Astronomy', desc: '天文工具' },
                { name: 'Design Suite', desc: '设计与出版工具' },
                { name: 'Scientific', desc: '科研与数值工具' },
                { name: '另有 4 种', desc: '共 7 种 Labs' },
              ],
            },
          ]}
          source={SITE}
        />
      ),
    },
    {
      id: 'editions',
      label: '六个版本',
      build: 'focus',
      render: () => (
        <EditionPicker
          kicker="Editions"
          title="六个正式版本，各管一类用途"
          options={[
            { name: 'Workstation', icon: 'laptop', tag: '桌面', desc: '搭载最新 GNOME 桌面的版本。', fit: '笔记本和台式机' },
            { name: 'KDE Plasma', icon: 'monitor', tag: '桌面', desc: '搭载最新 KDE Plasma 桌面；Fedora 42 起成为正式版本。', fit: '喜欢 Plasma 的桌面用户' },
            { name: 'Server', icon: 'server', tag: '服务器', desc: '在物理机或云上运行应用的服务器系统。', fit: '自建服务与应用' },
            { name: 'Cloud', icon: 'cloud', tag: '云', desc: '为云基础设施优化的系统镜像。', fit: '公有云和私有云实例' },
            { name: 'CoreOS', icon: 'box', tag: '容器', desc: '自动更新的最小化系统，用来大规模运行容器负载。', fit: '容器集群节点' },
            { name: 'IoT', icon: 'chip', tag: '物联网', desc: '面向物联网和边缘设备生态的基础系统。', fit: '边缘设备' },
          ]}
          source={`${SITE}；${WIKI}`}
          hint="按 → 逐个选中"
        />
      ),
    },
    {
      id: 'variants',
      label: '原子桌面与 Spins',
      build: 'focus',
      render: () => (
        <FilterChips
          kicker="按需挑选"
          title="同一个桌面，可能有两种做法"
          lead="Atomic 桌面整体原子更新，Spins 是传统安装方式。按 → 依次筛选。"
          chips={['Atomic', 'Spins', '平铺窗口', 'Labs']}
          cards={[
            { title: 'Silverblue', desc: '基于 GNOME，面向容器式工作流', icon: 'layers', in: [0] },
            { title: 'Kinoite', desc: '基于 KDE Plasma 的原子桌面', icon: 'layers', in: [0] },
            { title: 'Sway Atomic', desc: '基于 Sway 的原子桌面', icon: 'layers', in: [0, 2] },
            { title: 'COSMIC Atomic', desc: 'COSMIC 桌面的原子版', icon: 'layers', in: [0] },
            { title: 'Sway', desc: 'Sway 平铺窗口管理器', icon: 'window', in: [1, 2] },
            { title: 'i3', desc: 'i3 平铺窗口管理器', icon: 'window', in: [1, 2] },
            { title: 'COSMIC', desc: 'COSMIC 桌面环境', icon: 'window', in: [1] },
            { title: 'Xfce', desc: '完整、整合良好的桌面', icon: 'window', in: [1] },
            { title: 'Games', desc: 'Fedora 里的游戏合集', icon: 'cup', in: [3] },
            { title: 'Jam', desc: '音频编辑与音乐制作', icon: 'video', in: [3] },
            { title: 'Python Classroom', desc: '教 Python 的课堂环境', icon: 'code', in: [3] },
            { title: 'Security Lab', desc: '安全审计、取证与教学', icon: 'shield', in: [3] },
          ]}
          source={SITE}
          hint="按 → 切换筛选"
        />
      ),
    },
    {
      id: 'f44',
      label: 'Fedora 44',
      build: 'reveal',
      render: () => (
        <StatRow
          kicker="当前版本"
          title="Fedora Linux 44 里的主要组件"
          lead="2026 年 4 月 28 日发布，比最初目标晚了两周。"
          stats={[
            { value: '50', label: 'GNOME', note: 'Workstation 默认桌面' },
            { value: '6.6', label: 'KDE Plasma', note: 'KDE Plasma 版本的桌面' },
            { value: '6.19', label: 'Linux 内核', note: '随版本发布的内核' },
            { value: '2 次', label: '发布延期', note: '原定 4 月 14 日，两次推迟后发布' },
          ]}
          source="Fedora Magazine · Announcing Fedora Linux 44（2026-04）；Phoronix（2026）"
        />
      ),
    },
    {
      id: 'lifecycle',
      label: '生命周期',
      build: 'reveal',
      render: () => (
        <ReleaseTrain
          kicker="生命周期"
          title="大约每半年一版，每版维护约 13 个月"
          lead="第 X 版一直维护到第 X+2 版发布后约一个月，所以任何时候都有两个版本在维护。"
          start="2025-01"
          end="2027-09"
          today="2026-10"
          rows={[
            { version: 'Fedora 42', from: '2025-04', until: '2026-05', state: 'eol', note: '2025-04 → 2026-05-13' },
            { version: 'Fedora 43', from: '2025-10', until: '2026-12', state: 'supported', note: '2025-10-28 → 约 2026-12', estimate: true },
            { version: 'Fedora 44', from: '2026-04', until: '2027-05', state: 'current', note: '2026-04-28 → 约 2027-05', estimate: true },
            { version: 'Fedora 45', from: '2026-11', until: '2027-09', state: 'beta', note: '正式版目标 2026-11-03', estimate: true },
            { version: 'Rawhide', from: '2025-01', state: 'dev', note: '持续滚动的开发树' },
          ]}
          source={`${WIKI}；Linuxiac（2025、2026）。“约”为按规则推算的估计`}
        />
      ),
    },
    {
      id: 'process',
      label: '发布流程',
      build: 'focus',
      render: () => (
        <TabPanels
          kicker="一个版本怎么来"
          title="从开发树到正式版"
          tabs={[
            {
              tab: 'Rawhide',
              icon: 'branch',
              title: '新软件先进入开发树',
              body: 'Rawhide 是一份完整的 Fedora，新软件在这里加入和测试，之后才进入稳定版，所以它通常比当前稳定版更新。',
              points: ['持续更新，不分版本号', '很多软件直接取自上游代码快照'],
            },
            {
              tab: '测试版',
              icon: 'test',
              title: '先发 Beta，再定正式版',
              body: 'Fedora 44 Beta 在 2026 年 3 月 10 日发布，正式版在 4 月 28 日发布。',
              stat: { value: '7 周', label: 'F44 从 Beta 到正式版' },
            },
            {
              tab: '放行会议',
              icon: 'checklist',
              title: '有阻断问题就推迟',
              body: 'Fedora 45 原定 10 月 20 日，后备日期 10 月 27 日和 11 月 3 日；前两个日期都因候选版本或阻断问题被判定不放行。',
              stat: { value: '11-03', label: 'F45 当前目标日期' },
            },
            {
              tab: '升级',
              icon: 'refresh',
              title: '版本之间直接升级',
              body: '用户可以从一个版本升级到下一个版本，不必重装系统。',
              points: ['每版约维护 13 个月', '大约每六个月升级一次'],
            },
          ]}
          source={`${WIKI}；Phoronix、Linuxiac（2026）`}
          hint="按 → 切换标签"
        />
      ),
    },
    {
      id: 'firsts',
      label: '率先采用',
      render: () => (
        <Milestones
          kicker="First"
          title="几项后来普及的技术，Fedora 较早设为默认"
          events={[
            { date: 'Fedora 15', title: '用 systemd 替代 SysVinit 和 Upstart', tag: '初始化系统' },
            { date: 'Fedora 22', title: 'DNF 取代 Yum 成为默认包管理工具', tag: '软件包' },
            { date: 'Fedora 25', title: 'GNOME 默认使用 Wayland 会话', tag: '显示', focus: true },
            { date: 'Fedora 33', title: '桌面版默认使用 Btrfs 文件系统', tag: '文件系统' },
            { date: 'Fedora 34', title: '所有音频改由 PipeWire 处理', tag: '音频' },
          ]}
          source="Fedora Project Wiki · 各变更提案页（Features/systemd、Changes/ReplaceYumWithDNF、WaylandByDefault、BtrfsByDefault、DefaultPipeWire）"
        />
      ),
    },
    {
      id: 'upstream',
      label: '上下游',
      build: 'reveal',
      render: () => (
        <PathCrumbs
          kicker="和 RHEL 的关系"
          title="Fedora 是 CentOS Stream 和 RHEL 的上游"
          lead="Red Hat Enterprise Linux 从 Fedora 的版本分支出来；中间经过 ELN 和 CentOS Stream。"
          crumbs={[
            { label: 'Rawhide', sub: 'Fedora 开发树', tag: '社区', body: '所有新软件先进入这里，也是 Fedora 各个版本的来源。' },
            { label: 'ELN', sub: 'Enterprise Linux Next', tag: '重建', body: '用 Rawhide 的源码持续重新构建，从 RHEL 的角度检查上游状态。' },
            { label: 'CentOS Stream', sub: '每个大版本一次', tag: '分支', body: '每个大版本从某一时刻的 ELN 快照起步，之后按自己的节奏发展。' },
            { label: 'RHEL', sub: 'Red Hat 商业版', tag: '企业', body: 'RHEL 10 对应 2024 年 Fedora 40 前后的状态，之后的 Fedora 新功能要等下一个大版本。' },
          ]}
          source="Fedora Docs · ELN FAQ（2026 年查阅）；LWN.net（2024）；Wikipedia · Fedora Linux"
        />
      ),
    },
    {
      id: 'faq',
      label: '常见问题',
      build: 'focus',
      render: () => (
        <FaqAccordion
          kicker="常见问题"
          title={['五个常被', '问到的问题']}
          lead="治理、赞助和版本支持，是第一次接触 Fedora 时最常问的。"
          items={[
            { q: '谁来做决定？', a: 'Fedora Council 是最高的社区领导与治理机构；FESCo 负责技术决策，Mindshare 委员会协调推广等非技术工作。' },
            { q: 'Red Hat 在里面是什么角色？', a: 'Fedora 由 Red Hat 赞助，“Fedora”也是 Red Hat 的商标；开发者既有社区志愿者，也有 Red Hat 员工。' },
            { q: '有长期支持版吗？', a: '没有。每个版本通常维护至少 13 个月，到下下个版本发布后约一个月结束。' },
            { q: '升级要重装吗？', a: '不用。可以从一个版本直接升级到下一个版本。' },
            { q: 'Rawhide 是什么？', a: 'Fedora 的开发树：一份完整的发行版，新软件先在这里加入和测试，再进入之后的稳定版。' },
          ]}
          source={`${WIKI}；fedoraproject.org 页脚（2026）`}
          hint="按 → 逐条展开"
        />
      ),
    },
    {
      id: 'start',
      label: '开始使用',
      build: 'reveal',
      render: () => (
        <CtaBlock
          kicker="开始使用"
          title={['先在 U 盘上', '试一试']}
          lead="用官方的 Fedora Media Writer 做一个 Live 启动盘，可以先试用，不会改动硬盘。"
          commandLabel="下载页面"
          command="fedoraproject.org/workstation/download"
          actions={[{ label: '下载 Workstation' }, { label: '其他版本', kind: 'ghost' }]}
          steps={[
            { title: '制作启动盘', body: '用 Fedora Media Writer 或 dd 命令写入 U 盘。' },
            { title: '试用 Live 环境', body: '从 U 盘启动，试用时不写入硬盘。' },
            { title: '安装软件', body: '用 DNF 命令或 GNOME Software 安装软件。' },
            { title: '跟着升级', body: '每半年左右升级一次，不必重装系统。' },
          ]}
          source={WIKI}
        />
      ),
    },
    {
      id: 'end',
      label: '资源',
      build: 'reveal',
      render: () => (
        <FooterClosing
          kicker="谢谢"
          title={['想继续了解，', '从这些地方开始']}
          lead="文档、新闻和讨论区都由 Fedora 项目维护。"
          actions={[{ label: '加入 Fedora', kind: 'ghost' }]}
          columns={[
            { heading: '下载', links: ['fedoraproject.org', 'Fedora Media Writer'] },
            { heading: '阅读', links: ['docs.fedoraproject.org', 'fedoramagazine.org'] },
            { heading: '交流', links: ['discussion.fedoraproject.org', 'Ask Fedora'] },
          ]}
          wordmark="Fedora"
          note="资料截至 2026-10-30 · Fedora 45 尚未正式发布"
          source={SITE}
        />
      ),
    },
  ],
}
