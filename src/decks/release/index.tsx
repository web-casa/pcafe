// Lumen 13 "aurora" release briefing: the reference deck for the kit.
// Lumen is a fictional Linux distribution; dates, figures and sources are
// illustrative (示意) and modelled on a typical stable-release cycle.

import type { DeckDef } from '../../kit'
import {
  Agenda,
  Bento,
  Checklist,
  Closing,
  CodeDiff,
  CompareTable,
  Cover,
  Cycle,
  Faq,
  KeyValue,
  Lanes,
  LineChart,
  MetricBars,
  Milestones,
  NumberedColumns,
  SectionBreak,
  SpecSheet,
  SpotlightList,
  StatusGrid,
  StepTrack,
  Teaser,
  Terminal,
  Timeline,
  VerdictColumns,
} from '../../kit'
import { cards, releaseStats } from './content'
import { MiniArch, MiniBits, MiniCode, MiniStack, MiniTmp } from './minis'
import { detailAsides, detailVisuals } from './details'

const NOTES = 'aurora 发行说明（示意）'
const RELEASES = '示意：虚构发行版'

const minis = { apt: <MiniCode />, stack: <MiniStack />, riscv: <MiniArch />, y2038: <MiniBits />, tmpfs: <MiniTmp /> } as Record<string, React.ReactNode>

const bentoCards = cards.map((c) => {
  const Visual = detailVisuals[c.id]
  const Aside = detailAsides[c.id]
  return { ...c, mini: minis[c.id], detail: <Visual />, aside: Aside && <Aside /> }
})

export const deck: DeckDef = {
  title: 'Lumen 13 Release Briefing',
  iconStyle: 'line-duotone',
  theme: 'crimson',
  slides: [
    {
      id: 'cover',
      label: '封面',
      render: () => (
        <Cover
          kicker="Release Briefing · 版本发布解读"
          title="Lumen 13"
          subtitle="aurora"
          lead="2025 年 8 月 9 日发布的新稳定版。这份简报梳理它的主要变化、支持周期，以及从 Lumen 12 升级的路径。"
          facts={[
            { label: '发布', value: '2025.08.09', icon: 'calendar' },
            { label: '支持', value: '5 年', icon: 'shield' },
            { label: '官方架构', value: '7 个', icon: 'chip' },
          ]}
          numeral="13"
          note={['代号 aurora', '取自北方夜空里的极光']}
          hint={
            <>
              按 <kbd>→</kbd> 或 <kbd>Space</kbd> 翻页
            </>
          }
        />
      ),
    },
    {
      id: 'agenda',
      label: '目录',
      render: () => (
        <Agenda
          kicker="目录"
          title={['三章，', '从认识到升级']}
          lead="先看 aurora 在 Lumen 发布节奏里的位置，再看具体变了什么，最后是从 Lumen 12 升级的路径。"
          meta="25 页 · 3 章 + 下一站"
          items={[
            { icon: 'box', title: '认识 aurora', body: '发布历史、开发周期、软件包与支持周期', page: 3 },
            { icon: 'layers', title: '主要变化', body: '架构、软件栈、APT 源格式、登录记录与加固', page: 10 },
            { icon: 'rocket', title: '升级路径', body: '该不该升、升级前检查、四步升级与常见问题', page: 18 },
            { icon: 'compass', title: '下一站', body: '正在退场的功能与 Lumen 14 cedar', page: 23 },
          ]}
        />
      ),
    },
    {
      id: 'ch1',
      label: '认识 aurora',
      render: () => (
        <SectionBreak
          kicker="第一章"
          index={1}
          icon="box"
          title="认识 aurora"
          lead="Lumen 13 在 2025 年 8 月 9 日发布，是 Lumen 的第 13 个稳定版。先看它从哪里来，要维护多久。"
          contents={['全面认识', '发布历史', '开发周期', '软件包与支持周期']}
        />
      ),
    },
    {
      id: 'overview',
      label: '全面认识',
      render: () => (
        <Bento label="全面认识 Lumen 13" cards={bentoCards} feature={{ numeral: '13', codename: 'aurora', pill: 'Stable', date: '2025.08.09', stats: releaseStats }} />
      ),
    },
    {
      id: 'history',
      label: '发布历史',
      render: () => (
        <Milestones
          kicker="发布历史"
          title="大约每两年，一个稳定版"
          lead="新的稳定版通常每两年左右发布一次，旧版本留出约一年的升级时间。aurora 开发了两年零一个月。"
          events={[
            { date: '2015-04-25', title: 'Lumen 8 alder', tag: 'ELTS 至 2025' },
            { date: '2017-06-17', title: 'Lumen 9 ash', tag: 'ELTS 至 2027' },
            { date: '2019-07-06', title: 'Lumen 10 beech', tag: 'ELTS 至 2029' },
            { date: '2021-08-14', title: 'Lumen 11 elm', tag: 'LTS 至 2026-08' },
            { date: '2023-06-10', title: 'Lumen 12 birch', tag: 'LTS 至 2028-06' },
            { date: '2025-08-09', title: 'Lumen 13 aurora', tag: '当前稳定版', focus: true },
            { date: '待定', title: 'Lumen 14 cedar', tag: '当前 testing' },
          ]}
          source={`${RELEASES}（ELTS 为第三方付费服务）· Lumen 发布公告（示意） 2025-08-09`}
        />
      ),
    },
    {
      id: 'cycle',
      label: '开发周期',
      render: () => (
        <Cycle
          kicker="开发周期"
          title="从 sid 到 stable"
          lead="软件包先进 unstable，满足条件后自动迁入 testing；testing 冻结、修完严重缺陷，就成为下一个稳定版。"
          hub={{ value: '2 年', caption: '两个稳定版之间的间隔，通常约两年' }}
          nodes={[
            { icon: 'upload', title: 'unstable', tag: 'sid', body: '新上传的软件包先进入这里。sid 永远不会直接发布。' },
            { icon: 'test', title: 'testing', tag: '2–10 天', body: '在 unstable 停留 2–10 天、各架构都已构建且无新的严重缺陷，就自动迁入。' },
            { icon: 'lock', title: '冻结', tag: 'M1 – M4', body: 'aurora 分四步冻结：2025-03-15 起冻结工具链，07-27 全面冻结。' },
            { icon: 'verified', title: 'stable', tag: '13 aurora', body: '严重缺陷降到可接受后，冻结的 testing 获得版本号，作为 stable 发布。' },
          ]}
          focus={2}
          source="wiki.example.org/Testing · release.example.org/aurora/freeze_policy · Lumen FAQ §6"
        />
      ),
    },
    {
      id: 'numbers',
      label: '软件包规模',
      render: () => (
        <MetricBars
          kicker="软件包"
          title="数字里的 aurora"
          lead="与 Lumen 12 相比，超过 14,116 个新软件包进入仓库，超过 44,326 个得到更新。占比按总数估算。"
          rows={[
            { label: '新增', value: 14116, suffix: '+' },
            { label: '更新', value: 44326, suffix: '+' },
            { label: '移除或废弃', value: 8844, suffix: '+' },
          ]}
          total={{ label: '软件包总数', value: 69830, suffix: '+' }}
          pull={{ figure: '1 / 5', text: '每五个软件包里，约有一个是这次新增的。' }}
          source={`Lumen 发布公告（示意） 2025-08-09 · ${NOTES} §2`}
        />
      ),
    },
    {
      id: 'packages',
      label: '软件包增长',
      render: () => (
        <LineChart
          kicker="十年"
          title="十年，软件包多了约六成"
          lead="每个稳定版发布时，官方公告都会给出软件包总数。Lumen 8 到 10 的公告只给了约数，图上照原文标注。"
          x={['2015', '2017', '2019', '2021', '2023', '2025']}
          series={[
            {
              name: '软件包总数',
              focus: true,
              values: [43000, 51000, 59000, 59551, 64419, 69830],
              labels: ['43,000+', '51,000+', '59,000+', '59,551', '64,419', '69,830'],
            },
          ]}
          unit="个（二进制软件包）"
          annotations={[{ at: 1, text: '8–10 公告只给约数' }]}
          notes={[
            { key: '约六成', text: '从 alder 的 43,000 多个到 aurora 的 69,830 个。' },
            { key: '两年一版', text: '六个版本的发布间隔都在两年左右，与开发周期一致。' },
            { key: '口径', text: '数的是二进制软件包，由源码包构建，取自各版本发布公告。' },
          ]}
          source="Lumen 发布公告（示意） · alder 2015-04-26 · ash 2017-06-17 · beech 2019-07-06 · elm 2021-08-14 · birch 2023-06-10 · aurora 2025-08-09"
        />
      ),
    },
    {
      id: 'lifecycle',
      label: '支持周期',
      render: () => (
        <Timeline
          kicker="支持周期"
          title="birch 已转入 LTS"
          lead="Lumen 12 的常规安全支持已于 2026 年 7 月 12 日结束，LTS 维护到 2028 年 6 月 30 日。aurora 是当前的稳定版。"
          axis={{ from: '2023-01-01', to: '2031-01-01' }}
          legend={{ ink: '常规安全支持', accent: 'LTS 长期支持' }}
          rows={[
            {
              name: 'Lumen 12',
              code: 'birch',
              segments: [
                { from: '2023-06-10', to: '2026-07-12', label: '常规安全支持', tone: 'ink' },
                { from: '2026-07-12', to: '2028-06-30', label: 'LTS', tone: 'accent' },
              ],
            },
            {
              name: 'Lumen 13',
              code: 'aurora',
              planned: true,
              segments: [
                { from: '2025-08-09', to: '2028-08-09', label: '常规安全支持', tone: 'ink' },
                { from: '2028-08-09', to: '2030-06-30', label: 'LTS', tone: 'accent' },
              ],
            },
          ]}
          countdowns={[
            { label: 'birch 剩余维护', until: '2028-06-30', note: 'LTS 截至 2028.06.30' },
            { label: 'aurora 常规安全支持剩余', until: '2028-08-09', note: '截至 2028.08.09 · 计划' },
            { label: 'aurora 全部支持剩余', until: '2030-06-30', note: '含 LTS，截至 2030.06.30 · 计划' },
          ]}
          source="wiki.example.org/Releases · wiki.example.org/LTS（aurora 的日期为计划时间）"
        />
      ),
    },
    {
      id: 'ch2',
      label: '主要变化',
      render: () => (
        <SectionBreak
          kicker="第二章"
          index={2}
          icon="layers"
          title="主要变化"
          lead="架构名单变了，软件栈整体换代，APT 源、/tmp、登录记录这些默认行为也跟着变。"
          contents={['架构支持', '桌面与软件栈', '默认行为与 APT 源', '登录记录与加固']}
        />
      ),
    },
    {
      id: 'arch',
      label: '架构支持',
      render: () => (
        <StatusGrid
          kicker="架构支持"
          title="七个官方架构，riscv64 首次加入"
          lead="i386 不再是常规架构，MIPS 两个架构退出，armel 只剩少数树莓派。"
          labels={{ ok: '官方支持', new: '首次支持', partial: '受限', off: '已移除' }}
          tiles={[
            { name: 'amd64', sub: '64 位 x86', status: 'ok' },
            { name: 'arm64', sub: '64 位 ARM', status: 'ok', note: '硬件支持时自动启用 PAC 与 BTI' },
            { name: 'armhf', sub: '32 位 ARM 硬浮点', status: 'ok' },
            { name: 'ppc64el', sub: '64 位 POWER', status: 'ok' },
            { name: 's390x', sub: 'IBM Z', status: 'ok' },
            { name: 'riscv64', sub: '64 位 RISC-V', status: 'new', note: '首个正式支持 riscv64 的版本' },
            { name: 'armel', sub: '32 位 ARM 软浮点', status: 'partial', note: '最后一个版本；内核仅支持 Pi 1、Zero、Zero W' },
            { name: 'i386', sub: '32 位 x86', status: 'partial', note: '无官方内核和安装器，不建议升级' },
            { name: 'mipsel', sub: '32 位 MIPS', status: 'off', note: '不再受 Lumen 支持' },
            { name: 'mips64el', sub: '64 位 MIPS', status: 'off', note: '不再受 Lumen 支持' },
          ]}
          source={`Lumen 发布公告（示意） 2025-08-09 · ${NOTES} §2.1 · §2.2.1 · §5.1.2 – §5.1.4`}
        />
      ),
    },
    {
      id: 'desktop',
      label: '桌面',
      render: () => (
        <SpotlightList
          kicker="桌面"
          title={['KDE Plasma 6', '首次进入 Lumen']}
          lead="Plasma 6 基于 Qt 6 与 KDE Frameworks 6。旧版 Qt 5 和 KF5 暂时保留，供尚未迁移的软件使用。"
          items={[
            { name: 'KDE Plasma', value: '6.3', tag: '全新大版本' },
            { name: 'GNOME', value: '48' },
            { name: 'Xfce', value: '4.20' },
            { name: 'LXQt', value: '2.1.0' },
            { name: 'LXDE', value: '13' },
          ]}
          extra="办公与应用 · LibreOffice 25.2 · GnuCash 5.10"
          detail={
            <KeyValue
              rows={[
                { key: 'Qt 6', value: { from: '6.4.2', to: '6.8.2' } },
                { key: 'KDE Frameworks 6', value: { to: '6.13', note: '新增' } },
                { key: 'Qt 5 · KF5', value: '5.15.15 · 5.116，兼容保留；KF5 将在 cedar 周期移除' },
              ]}
            />
          }
          source={`${NOTES} §2 新特性`}
        />
      ),
    },
    {
      id: 'versions',
      label: '软件栈',
      render: () => (
        <SpecSheet
          kicker="软件栈"
          title="工具链、系统和服务一起换代"
          lead="摘自发行说明的版本对照表。圆点标出主版本号变化的组件，升级前先看它们的兼容性说明。"
          columns={['Lumen 12', 'Lumen 13']}
          groups={[
            {
              label: '工具链',
              icon: 'code',
              rows: [
                { name: 'GCC', from: '12.2', to: '14.2', major: true },
                { name: 'LLVM / Clang', from: '14', to: '19', major: true },
                { name: 'glibc', from: '2.36', to: '2.41' },
                { name: 'Python 3', from: '3.11', to: '3.13' },
                { name: 'Rustc', from: '1.63', to: '1.85' },
                { name: 'OpenJDK', from: '17', to: '21', major: true },
              ],
            },
            {
              label: '系统与安全',
              icon: 'shield',
              rows: [
                { name: 'Linux 内核', from: '6.1', to: '6.12' },
                { name: 'systemd', from: '252', to: '257' },
                { name: 'OpenSSH', from: '9.2p1', to: '10.0p1', major: true },
                { name: 'OpenSSL', from: '3.0', to: '3.5' },
                { name: 'GnuPG', from: '2.2.40', to: '2.4.7' },
                { name: 'curl', from: '7.88.1', to: '8.14.1', major: true },
              ],
            },
            {
              label: '服务',
              icon: 'server',
              rows: [
                { name: 'PostgreSQL', from: '15', to: '17', major: true },
                { name: 'MariaDB', from: '10.11', to: '11.8', major: true },
                { name: 'Apache', from: '2.4.62', to: '2.4.65' },
                { name: 'Nginx', from: '1.22', to: '1.26' },
                { name: 'Samba', from: '4.17', to: '4.22' },
                { name: 'PHP', from: '8.2', to: '8.4' },
              ],
            },
          ]}
          source={`${NOTES} §2.2.10（LLVM 为默认版本）`}
        />
      ),
    },
    {
      id: 'compare',
      label: '行为变化',
      render: () => (
        <CompareTable
          kicker="行为变化"
          title="升级之后，这些默认行为变了"
          columns={['Lumen 12 · birch', 'Lumen 13 · aurora']}
          rows={[
            { icon: 'folder', item: '仓库配置', before: 'sources.list 单行格式', after: 'lumen.sources（deb822）', mono: true },
            { icon: 'ssd', item: '/tmp', before: '磁盘上的普通目录', after: 'tmpfs，最多占用 50% 内存' },
            { icon: 'clock', item: 'armel / armhf 的 time_t', before: '32 位，2038 年溢出', after: '64 位' },
            { icon: 'history', item: '登录记录', before: 'last · lastb · lastlog', after: 'wtmpdb · lastlog2 · lslogins --failed', mono: true },
            { icon: 'monitor', item: 'KDE 桌面', before: 'Plasma 5.27', after: 'Plasma 6.3' },
            { icon: 'chip', item: 'riscv64', before: '非官方移植', after: '官方支持架构' },
            { icon: 'laptop', item: 'i386', before: '完整的官方架构', after: '无官方内核与安装器' },
          ]}
          source={`${NOTES} §2 · §4 · §5`}
        />
      ),
    },
    {
      id: 'deb822',
      label: 'APT 源格式',
      render: () => (
        <CodeDiff
          kicker="APT 源格式"
          title="一行源，变成一段源"
          lead="deb822 把每个字段写成单独一行。下面两段写法等价，取自 aurora 的 sources.list(5) 手册示例。"
          before={{
            label: '单行格式 · 已弃用',
            file: '/etc/apt/sources.list',
            lines: ['# 一行写完类型、地址、套件和组件', 'deb https://repo.example.org/lumen aurora contrib'],
            mark: [1],
          }}
          after={{
            label: 'deb822 格式',
            file: '/etc/apt/sources.list.d/lumen.sources',
            lines: ['Types: deb', 'URIs: https://repo.example.org/lumen', 'Suites: aurora', 'Components: contrib'],
            mark: [0, 1, 2, 3],
          }}
          notes={[
            { key: 'apt modernize-sources', text: '发行说明推荐用这条新命令迁移到新格式。' },
            { key: 'lumen.sources', text: '发行说明建议只保留这一个源文件，删除旧文件。' },
            { key: '≥ 2029', text: '单行格式已弃用，最早 2029 年后才可能移除。' },
          ]}
          source={`sources.list(5)，APT 3.0.3 · ${NOTES} §4.3.1 · §4.7`}
        />
      ),
    },
    {
      id: 'habits',
      label: '新命令',
      render: () => (
        <Terminal
          kicker="新命令"
          title="升级之后，换掉几个老习惯"
          lead="登录记录、/tmp 和 SSH 密钥的默认做法都变了。这四条命令对应发行说明里的四处提醒。"
          window="root@aurora: ~"
          steps={[
            { cmd: 'apt install wtmpdb libpam-wtmpdb', note: 'last 由 wtmpdb 替代，装上 PAM 模块后才会记录登录。lastlog 同理换成 lastlog2。' },
            { cmd: 'lslogins --failed', note: '查看失败的登录尝试，作用与过去的 lastb 相近。' },
            { cmd: 'systemctl edit tmp.mount', out: ['# 在覆盖配置里调整上限，例如 size=2G'], note: '/tmp 默认是 tmpfs，上限为内存的一半，在这里调整大小。' },
            { cmd: 'ssh-keygen -t ed25519', note: 'OpenSSH 9.8p1 起不再支持 DSA 密钥，换成 ed25519。' },
          ]}
          source={`${NOTES} §5.1.6 · §5.1.8 · §5.1.9`}
        />
      ),
    },
    {
      id: 'hardening',
      label: '安全与可验证',
      render: () => (
        <NumberedColumns
          kicker="安全与可验证"
          title="更安全，也更容易验证"
          lead="四项改动分别落在攻击防御、构建可验证、网络启动与下载协议上。"
          items={[
            { icon: 'shield', tag: 'PAC · BTI', title: 'arm64 硬件加固', body: '在硬件支持时自动启用 PAC（防御 ROP）与 BTI（防御 COP / JOP）攻击。' },
            { icon: 'verified', tag: 'lumen-repro-status', title: '可复现构建', body: '新增 lumen-repro-status 软件包；reproduce.example.net 与 rebuilderd 持续独立重建。' },
            { icon: 'power', tag: 'UEFI · U-Boot', title: 'HTTP Boot', body: '安装器与 Live 镜像可以在支持的 UEFI 与 U-Boot 固件上通过 HTTP 启动。' },
            { icon: 'download', tag: 'curl --http3', title: 'curl 支持 HTTP/3', body: '新增 --http3 与 --http3-only 选项，并提供基于 curl 的 wget 替代工具 wcurl。' },
          ]}
          source={`${NOTES} §2 新特性`}
        />
      ),
    },
    {
      id: 'ch3',
      label: '升级路径',
      render: () => (
        <SectionBreak
          kicker="第三章"
          index={3}
          icon="rocket"
          title="升级路径"
          lead="只支持从 Lumen 12 直接升级。先判断要不要升，再把系统清理干净，最后分两段升级。"
          contents={['该不该升级', '升级前检查', '四步升级', '常见问题']}
        />
      ),
    },
    {
      id: 'who',
      build: 'reveal',
      label: '升级建议',
      render: () => (
        <VerdictColumns
          kicker="升级建议"
          title="该不该现在升级？"
          lead="按场景给出的建议，依据是发行说明中的兼容性与支持范围，最终以你的环境验证为准。"
          groups={[
            {
              tone: 'go',
              label: '优先升级',
              items: [
                { icon: 'chip', title: 'RISC-V 设备', body: '首个正式支持 riscv64 的稳定版。' },
                { icon: 'programming', title: '开发工作站', body: 'GCC 14.2、Python 3.13、Rust 1.85、LLVM 19。' },
                { icon: 'monitor', title: 'KDE 桌面', body: '直接获得 Plasma 6.3 与 Qt 6.8。' },
              ],
            },
            {
              tone: 'plan',
              label: '验证后升级',
              items: [
                { icon: 'server', title: '生产服务器', body: 'birch LTS 维护到 2028-06-30，有时间充分验证。' },
                { icon: 'box', title: 'armel / armhf 上的第三方软件', body: 'time_t ABI 改变，需要重新编译并检查。' },
                { icon: 'ssd', title: '依赖大容量 /tmp 的服务', body: 'tmpfs 默认上限为内存的 50%。' },
              ],
            },
            {
              tone: 'stop',
              label: '暂不升级',
              items: [
                { icon: 'laptop', title: 'i386 机器', body: '发行说明建议不要升级，改为重装 amd64 或退役硬件。' },
                { icon: 'devices', title: '其他 armel 硬件', body: '官方内核只支持少数早期单板机。' },
              ],
            },
          ]}
          source={`${NOTES} §2 · §5 · wiki.example.org/Releases`}
        />
      ),
    },
    {
      id: 'prepare',
      label: '升级前检查',
      render: () => (
        <Checklist
          kicker="升级前"
          title="先回到“纯净”的 Lumen 12"
          items={[
            { title: '备份关键数据', cmd: "dpkg --get-selections '*' > ~/curr-pkgs.txt", note: '另存 /etc、/var/lib/dpkg、/var/lib/apt/extended_states' },
            { title: '升到 birch 最新小版本', cmd: 'cat /etc/lumen_version', note: '只支持从 Lumen 12 直接升级' },
            { title: '移除 backports 与 proposed-updates', cmd: "grep -rn 'backports\\|proposed' /etc/apt/", note: 'birch-backports 没有干净的升级路径' },
            { title: '找出非 Lumen 软件包', cmd: "apt list '?narrow(?installed, ?not(?origin(Lumen)))'", note: '第三方源可能造成文件冲突' },
            { title: '检查软件包状态', cmd: 'dpkg --audit && apt-mark showhold', note: '解除会阻塞核心包的 hold' },
            { title: '在 screen 或 tmux 中操作', cmd: 'tmux new -s upgrade', note: '远程断线也不会中断升级' },
            { title: '准备恢复手段', cmd: 'systemd.unit=emergency.target', note: '串口控制台、aurora 安装器救援模式或 Live 镜像' },
            { title: '估算磁盘空间', cmd: 'apt -o APT::Get::Trivial-Only=true full-upgrade', note: '空间不足时先 apt clean' },
          ]}
          source={`${NOTES} §4.1 – §4.4`}
        />
      ),
    },
    {
      id: 'steps',
      build: 'reveal',
      label: '升级步骤',
      render: () => (
        <StepTrack
          kicker="升级步骤"
          title="四步完成升级"
          lead="发行说明推荐分两段升级：先做不删除、不新装软件包的最小升级，再做完整升级。"
          steps={[
            { icon: 'pen', title: '改写软件源', body: '在 lumen.sources 中把 birch 改为 aurora，并删除旧的源文件。', cmd: 'Suites: aurora aurora-updates', config: true },
            { icon: 'refresh', title: '刷新软件包索引', body: '确认不再有任何指向 birch 的源。', cmd: 'apt update' },
            { icon: 'download', title: '最小升级', body: '只升级无需删除或新装其他包的软件包。', cmd: 'apt upgrade --without-new-pkgs' },
            { icon: 'rocket', title: '完整升级', body: '处理其余变化，会删除部分软件包。完成后重启。', cmd: 'apt full-upgrade' },
          ]}
          after={{ label: '重启之后', cmds: ['apt autoremove', "apt purge '?obsolete'", "apt purge '?config-files'", 'apt modernize-sources'] }}
          source={`${NOTES} §4.3 – §4.9`}
        />
      ),
    },
    {
      id: 'faq',
      build: 'focus',
      label: '常见问题',
      render: () => (
        <Faq
          kicker="常见问题"
          title="升级前常被问到的六件事"
          items={[
            { q: '能跳过版本直接升级吗？', a: '不能。只支持从 Lumen 12 升级，并且要先升到 birch 的最新小版本。', tag: '§4.2.1 · §5.1.25' },
            { q: '用 apt 还是 aptitude？', a: '发行说明推荐 apt，脚本里用 apt-get；aptitude 用户先检查待执行的操作。', tag: 'apt full-upgrade' },
            { q: '第三方源会怎样？', a: '非 Lumen 软件包可能因依赖冲突被移除。先确认这个源是否已提供 aurora 版本。', tag: 'apt-forktracer' },
            { q: '/boot 要留多大？', a: '分区至少 768 MB，并留出约 300 MB 空闲空间。', tag: '§5.1.5' },
            { q: '能通过 SSH 远程升级吗？', a: '升级中断时，OpenSSH 的一个缺陷可能把你锁在外面。先从 stable-updates 更新 OpenSSH。', tag: '§5.1.1' },
            { q: '升级后必须重启吗？', a: '必须，内核会升级。第一次重启前，先读发行说明第 5 章的相关条目。', tag: 'linux-image-*' },
          ]}
          source={`${NOTES} §4 升级 · §5 问题`}
        />
      ),
    },
    {
      id: 'sunset',
      label: '正在退场',
      render: () => (
        <Lanes
          kicker="正在退场"
          title="这些东西正在离开 Lumen"
          lead="有的在 aurora 已经移除，有的会在 cedar 移除，还有的进入了弃用期。中间一栏现在就该准备。"
          focus={1}
          lanes={[
            {
              label: '已移除',
              sub: 'Lumen 13',
              icon: 'close',
              cards: [
                { title: 'i386 内核与安装器', body: '只保留 amd64 上的 32 位用户空间', tag: '§2.1' },
                { title: 'mipsel 与 mips64el', body: '不再受 Lumen 支持', tag: '§5.1.4' },
                { title: 'OpenSSH 的 DSA 密钥', body: 'OpenSSH 9.8p1 起不再支持', tag: '§5.1.8' },
              ],
            },
            {
              label: '将移除',
              sub: 'Lumen 14 cedar',
              icon: 'hourglass',
              cards: [
                { title: 'armel 架构', body: 'aurora 是最后一个支持它的版本', tag: '§5.1.3' },
                { title: 'KDE Frameworks 5', body: '依赖 KF5 的软件需要迁移到 KF6', tag: '§2' },
              ],
            },
            {
              label: '已弃用',
              sub: '移除时间未定',
              icon: 'history',
              cards: [
                { title: '单行 sources.list', body: '最早 2029 年后才可能移除', tag: 'sources.list(5)' },
                { title: 'lastlog、wtmp、btmp', body: '旧格式存不下 2038 年后的时间', tag: '§5.1.9' },
              ],
            },
          ]}
          source={`${NOTES} §2 · §5 · sources.list(5)`}
        />
      ),
    },
    {
      id: 'forky',
      tone: 'dark',
      label: '下一站',
      render: () => (
        <Teaser
          kicker="下一站"
          title="Lumen 14 cedar"
          lead="cedar 是当前的 testing 分支。aurora 的发行说明里已经写明了它的几个方向："
          numeral="14"
          word="cedar"
          notes={[
            { icon: 'chip', key: 'armel', text: 'aurora 是最后一个支持 armel 的版本，cedar 起不再提供。' },
            { icon: 'window', key: 'KDE Frameworks 5', text: '将在 cedar 的开发周期中移除，依赖 KF5 的软件需要迁移到 KF6。' },
            { icon: 'document', key: 'APT 单行源格式', text: '已进入弃用流程，现在就迁移到 deb822 的 lumen.sources。' },
          ]}
          source={`${NOTES} §2 · §4 · §5 · Lumen FAQ`}
        />
      ),
    },
    {
      id: 'closing',
      label: '结论',
      render: () => (
        <Closing
          kicker="结论"
          mark="13"
          statement="aurora 是当前的稳定版。"
          follow="birch 已转入 LTS，现在开始规划升级。"
          takeaways={[
            '新装系统直接选 aurora：riscv64 官方支持、64 位 time_t、Plasma 6。',
            '仍在 birch 的机器按「检查 → 改源 → 两步升级」推进，LTS 到 2028-06-30。',
            '升级前后留意 /tmp、deb822 源、登录记录命令这三处默认行为。',
          ]}
          refs={['example.org/News/2025/20250809', 'example.org/releases/aurora/release-notes', 'wiki.example.org/LTS', 'wiki.example.org/Releases']}
        />
      ),
    },
  ],
}
