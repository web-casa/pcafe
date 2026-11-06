// Content for the fictional Lumen 13 release deck. Figures are illustrative (示意).

export type CardId = 'release' | 'apt' | 'stack' | 'riscv' | 'y2038' | 'tmpfs'

export interface CardDef {
  id: CardId
  index: string
  /** Pre-broken lines; the detail title reuses them so the shared title scales uniformly. */
  title: string[]
  summary: string
  lead: string
  source: string
  /** Anchoring figure at the foot of the detail's copy column. */
  figure?: { value: string; unit?: string; caption: string }
}

const RELEASE_NOTES = 'aurora 发行说明（示意）'

export const cards: CardDef[] = [
  {
    id: 'release',
    index: '01',
    title: ['Lumen 13'],
    summary: '历时两年零一个月开发。首次正式支持 riscv64；除 i386 外，全部架构改用 64\u00a0位 time_t。',
    lead: '2025 年 8 月 9 日发布。由 Lumen 安全团队与 LTS 团队接力维护，总计提供 5 年支持。',
    source: 'Lumen 发布公告（示意） 2025-08-09 · wiki.example.org/LTS',
  },
  {
    id: 'apt',
    index: '02',
    title: ['APT 源改用', 'deb822 格式'],
    summary: '单行 sources.list 已进入弃用',
    lead: 'APT 正在弃用旧的单行仓库格式。发行说明建议只保留一个 lumen.sources 文件，并删除旧的源文件。',
    source: `${RELEASE_NOTES} §4 升级`,
  },
  {
    id: 'stack',
    index: '03',
    title: ['核心软件栈', '整体升级'],
    summary: '对比 Lumen 12 birch',
    lead: '工具链、运行时与系统组件同步换代。下表取自发行说明中 Lumen 12 与 13 的版本对照。',
    source: `${RELEASE_NOTES} §2 新特性`,
    figure: { value: '6.12', caption: 'Linux LTS 内核系列' },
  },
  {
    id: 'riscv',
    index: '04',
    title: ['riscv64 正式支持'],
    summary: '首个正式支持 64 位 RISC-V 的版本',
    lead: '官方架构共 7 个，riscv64 首次加入。与此同时，i386 与 armel 的支持范围明显收窄。',
    source: `${RELEASE_NOTES} §2 · §5`,
    figure: { value: '7', caption: '个官方支持架构' },
  },
  {
    id: 'y2038',
    index: '05',
    title: ['64 位 time_t'],
    summary: '除 i386 外，全部架构跨过 2038',
    lead: '除 i386 外，所有架构改用 64\u00a0位 time_t ABI，时间戳不会在 2038 年溢出。',
    source: `${RELEASE_NOTES} §2 · §5.1.9`,
    figure: { value: '2038', caption: '32 位时间戳溢出的年份' },
  },
  {
    id: 'tmpfs',
    index: '06',
    title: ['/tmp 改用 tmpfs'],
    summary: '默认上限为内存的一半，按需占用',
    lead: '/tmp 默认放进内存中的 tmpfs，上限为内存的 50%，只在写入文件时占用。放入大文件可能耗尽内存。',
    source: `${RELEASE_NOTES} §5`,
    figure: { value: '50', unit: '%', caption: '/tmp 默认可占用的内存上限' },
  },
]

export const releaseStats = [
  { value: '69,830+', label: '软件包总数' },
  { value: '7', label: '官方架构' },
  { value: '5 年', label: '支持周期' },
]

export const packageFlow = [
  { value: '14,116', label: '新增' },
  { value: '44,326', label: '更新' },
  { value: '8,844', label: '移除或废弃' },
]

export const stack = [
  { name: 'Linux 内核', old: '6.1', next: '6.12' },
  { name: 'GCC', old: '12.2', next: '14.2' },
  { name: 'LLVM / Clang', old: '14', next: '19' },
  { name: 'glibc', old: '2.36', next: '2.41' },
  { name: 'Python', old: '3.11', next: '3.13' },
  { name: 'Perl', old: '5.36', next: '5.40' },
  { name: 'PHP', old: '8.2', next: '8.4' },
  { name: 'PostgreSQL', old: '15', next: '17' },
  { name: 'systemd', old: '252', next: '257' },
  { name: 'Rust', old: '1.63', next: '1.85' },
  { name: 'OpenJDK', old: '17', next: '21' },
  { name: 'KDE Plasma', old: '5.27', next: '6.3' },
]

export const architectures = [
  { name: 'amd64', bits: 64 },
  { name: 'arm64', bits: 64 },
  { name: 'armel', bits: 32, note: '最后一版' },
  { name: 'armhf', bits: 32 },
  { name: 'ppc64el', bits: 64 },
  { name: 'riscv64', bits: 64, note: '新增' },
  { name: 's390x', bits: 64 },
]
