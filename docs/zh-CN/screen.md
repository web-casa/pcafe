# 展示屏

循环播放的全屏页面，用在活动大屏、店铺橱窗或展厅。它的设计目标是无人值守连续运行多天，限制见文末的“已知限制”。和演示一样，它是一个离线 HTML 文件。

规则为什么是这样，以及出处：代码仓库的 [`plans/research-screen.md`](../../plans/research-screen.md)。

## 做一个展示屏

```bash
npx pcafe screen new my-hall         # 生成 src/screens/my-hall/index.tsx
npx pcafe screen dev my-hall         # 预览
npx pcafe screen check my-hall       # 类型检查、构建、QA，最后一行是 PASS 或 FAIL
npx pcafe screen build my-hall       # 输出 dist/screen/my-hall.html
```

写完要跑到 `PASS`，并看过 `qa/screen/my-hall/` 里的每张图。

`check` 需要 Playwright 的 Chromium（`npx playwright install chromium`），依次运行类型检查 → 构建 → QA。首次运行若没装浏览器，会打印这条安装命令并以非零状态退出。检查和构建都不再需要 Python 或系统字体：CJK 子集随仓库提交，`npm run fonts:verify` 负责校验；`npm run fonts` 只给维护者重新生成子集。`build` 不跑 QA，所以要在 `check` 之后用，不能代替它。

```tsx
import { BigNumber, Hero, defineScreen } from '../../screen'

export const screen = defineScreen({
  title: '我的展厅',
  theme: 'cobalt',
  face: 'editorial',                  // editorial | grotesk | heavy
  atmosphere: 'stars',                // stars | grid | none
  orientation: 'landscape',           // landscape | portrait | both
  venue: { diagonalIn: 98, distanceM: 5, baselineM: 1.4, panel: 'lcd' },
  clock: { date: true },
  reloadAt: '04:30',
  scenes: [
    { id: 'open', label: '开场', seconds: 12, render: () => <Hero title={['一个信息']} source="来源：…" /> },
  ],
})
```

## 字号由场地决定

`venue` 必填。写明屏幕大小（`diagonalIn`，LED 墙用 `longEdgeMm`）、希望从多远读到（`distanceM`）、文字离地多高（`baselineM`）。引擎据此算出所有字号，所以**没有哪个模板能设置字号**。字段放不下，就删字或拆场景。

QA 测量字形的真实高度：

| 文字 | 规则 |
|---|---|
| 拉丁字母、数字 | 2010 ADA Standards Table 703.5.5，按大写 I 测量 |
| 中文 | 同一数值 × 1.54（Zhang et al. 2020） |
| 小字（来源、署名） | 在 `nearM`（默认 1.5 米）处 16 弧分，且至少 20 设计 px |

举例：98 英寸屏幕从 5 米读，中文字号约 80 设计 px。5 米宽的 LED 墙从 10 米读、安装位置较高时，约 77 设计 px。

## 模板

每个模板都有自己的横屏和竖屏版式。下表的上限针对示例场地，真正的上限以你的场地下 QA 的结果为准。

| 模板 | 用途 | 字段 |
|---|---|---|
| `Hero` | 一个信息 | `kicker?`、`title[]`（≤ 3 行）、`portraitTitle[]?`、`sub?`、`art?`、`source`、`credit?` |
| `BigNumber` | 一个数字 | `kicker?`、`value`（≤ 7 个字符）、`unit?`、`label`、`note?`、`art?`、`source`、`credit?` |
| `Moments` | 3–5 个事件，依次点亮 | `kicker?`、`title[]`、`items[{ when, at?, label }]`、`source` |
| `Quote` | 某人说过的一句话 | `kicker?`、`lines[]`、`original?`、`by`、`source` |
| `Pair` | 两半，后一半是落点 | `kicker?`、`items[2]{ big, small }`、`source` |
| `Board` | 固定的小表格 | `kicker?`、`title`、`rows[{ left, right }]`（≤ 5）、`source` |
| `NowNext` | 正在进行和下一场，由时钟决定 | `source` |
| `Agenda` | 今日议程，由时钟决定 | `title?`、`source` |

`art` 写成 `{ src, mode: 'disc' | 'ground' }`，`src` 是用 import 引入的 `decor-` 或 `photo-` 图片，并在 `credit` 里写明。

中文可以在任意两个字之间换行，所以较长的 `sub` 或 `note` 可能把词组拆开。要保持完整，用 JS 字符串写换行：`sub={'第一句，\n第二句。'}`。普通的 `sub="..."` 属性里，JSX 会把 `\n` 当成字面文字。议程标题来自数据，不能写换行，要写得足够短，或者检查竖屏的 `NowNext`，那里会以最大字号换行。

不要嵌入 kit 幻灯片。它们的正文字号是给坐在屋里的人设计的，在任何真实的展示屏场地都过不了距离规则。

## 内容规则

- 一个场景一个信息。三个数字就是三个场景。
- `source` 必填，以小字显示。查不到出处的事实不要写。
- 虚构数据：在屏幕上设置 `sample`。它以正文字号显示在每个场景上，任何场景缺了它 QA 都会 FAIL。
- `seconds` 要够读完：2 秒 + 字符数 ÷ 每分钟 260 + 单词数 ÷ 每分钟 238，最少 6 秒。

## 时间

`timezone` 是 IANA 名称，不写就用播放设备自己的时区。下面的内容都跟随它。

```tsx
{ id: 'lunch', label: '午餐', seconds: 9, when: { from: '12:00', to: '13:30' }, render: … }  // 只在这段时间播放
{ when: { from: '22:00', to: '02:00' } }                                      // 跨午夜
{ when: [{ from: '09:00', to: '18:00', days: [1, 2, 3, 4, 5] }] }             // 工作日；0 是周日
{ when: { from: '08:00', to: '20:00', dates: ['2026-11-14'] } }               // 某一天
```

要显示正在进行和下一场，写 `agenda: (data) => sessions`。每场有 `start`、`end`、`title`、`who?`、`room?`、`date?`、`isBreak?`。`NowNext`、`Agenda` 和 `items` 为函数的 `ticker` 都跟随时钟，不需要重新加载。`states` 列出 QA 要拍照的时刻。

## 实时数据

```tsx
data: { initial: SAMPLE, parse: parseEvent, everySec: 30, staleAfterSec: 120, source: 'event-data.js' }
```

设置 `source`，或者在 URL 里写 `?data=`。

- **本地文件**必须是放在页面旁边的 `.js` 文件，用相对路径。内容是一次调用：`window.__screenData({ ... })`。从 `file://` 打开的页面读不了 JSON。
- **URL** 必须返回 JSON，如果页面在 `file://` 上，还要允许 CORS。远程 `.js` 会被拒绝，因为它会在页面里作为代码运行。

`parse` 遇到格式错误的内容应该抛出异常：上一份正确的数据会保留，刷新后也还在。超过 `staleAfterSec` 没有拿到正确数据时，屏幕上显示 `数据已过期 · 最后更新 14:32`，数据恢复后消失。

## 安装

把这一个 HTML 文件复制到播放设备，然后：

```bash
# Linux 或树莓派。参数来自树莓派的 kiosk 教程。
chromium --kiosk --noerrdialogs --disable-infobars --no-first-run --start-maximized \
  "file:///home/signage/my-hall.html"
```

**浏览器之外必须有一个守护进程。** 页面能接住自己的错误，但重启不了崩溃的渲染进程，也发现不了自己卡死的主线程。下面的 unit 只是起点，没有在真实的播放设备上跑过；用户服务还需要你的图形会话环境，所以活动之前要测试，包括拔电源。

```ini
# /etc/systemd/user/signage.service
[Service]
ExecStart=/usr/bin/chromium --kiosk --noerrdialogs --disable-infobars --no-first-run --start-maximized file:///home/signage/my-hall.html
Restart=always
RestartSec=5
[Install]
WantedBy=default.target
```

设备上还要做这些：

- 在操作系统里关闭屏幕熄灭和 DPMS，关闭屏幕自带的节能定时器。页面会请求 wake lock，但浏览器只把它当成建议。
- 把屏幕的画面尺寸设为 1:1 / Just Scan / 不过扫描。
- 让系统时钟通过 NTP 同步。排期准不准，取决于设备时钟准不准。
- 树莓派要打开 overlay 文件系统，这样断电不会损坏存储卡。
- 竖装屏幕：尽量在操作系统里旋转。做不到的话，在 URL 加 `?rotate=90` 或 `?rotate=270`。屏幕可以往哪边转，查说明书，各厂商不一样。

## 操作按键

不按键时什么都不显示。鼠标指针是隐藏的。

| 按键 | 作用 |
|---|---|
| `F` | 全屏 |
| `Space` | 暂停，10 分钟后自动继续 |
| `N` / `→`，`P` / `←` | 下一个，上一个 |
| `I` | 状态：时钟、运行时长、内存、wake lock、数据、错误日志 |
| `R` | 重新加载 |

## URL 参数

| 参数 | 含义 |
|---|---|
| `?now=14:30`，`?now=2026-11-14T14:30` | 让屏幕时钟假定现在是这个时间 |
| `?speed=60` | 让时间跑快，用来预览 |
| `?pin=<scene id>` | 停在一个场景上 |
| `?rotate=90` | 在没有旋转的输出上旋转画面 |
| `?data=<路径或 url>` | 数据源 |

## 出问题时会怎样

| 故障 | 行为 |
|---|---|
| 场景抛出异常或什么都没渲染 | 记录并跳过，不会黑屏。休息 5 分钟，翻倍直到 1 小时，然后再试 |
| 所有场景都失败，或者没有场景在排期内 | 显示带标题的等待卡，每 30 秒重试 |
| 找不到责任场景的错误 | 记录，循环继续 |
| 数据轮询失败或格式错误 | 上一份正确的数据保留。退避到 10 分钟一次。到设定时间后显示过期提示 |
| 堆内存超过 `memoryLimitMb`（默认 400） | 在下一次场景切换时重新加载，30 分钟内最多一次。仅限 Chromium |
| `reloadAt` | 每天在下一次场景切换时重新加载一次。通过 http 提供时，只有 `HEAD` 检查成功才会加载 |
| 渲染进程崩溃或卡死，或者机器重启 | 页面无能为力：这是守护进程的工作 |

## 烧屏

底色接近纯黑，不用纯白。时钟、名称和来源每次切换场景时移动几个像素，每 10 分钟左右互换（`burnIn: { flipMinutes, shift }`）。`panel: 'oled'` 把移动幅度加倍，`'led'` 关闭移动。如果完整循环一遍后，屏幕上有超过 1% 的区域始终高于 25% 亮度，QA 会 FAIL。这只能降低风险，不能消除风险。比如 LG 的 B2B 保修不包括残影。请读你自己的保修条款。

## QA 检查什么

`scripts/screen-qa.mjs` 针对构建好的文件运行，按 `orientation` 在 1920×1080 和 3840×2160，和/或 1080×1920 和 2160×3840 上检查：

溢出、裁切、重叠和 90% 安全区。按字形检查文字大小是否符合场地。相对真实像素的对比度至少 4.5:1。回退到系统字体。来源是否存在，示例标注。每个场景的时间。每个时间窗口的边界和实时时钟翻转。场景抛出异常、在 effect 里失败、什么都没渲染。所有场景失败，然后恢复。异步错误。操作按键。数据源、错误数据、文件缺失、过期状态、恢复、断线期间重新加载、远程脚本。夜间重新加载和内存重新加载。烧屏像素。800 次场景切换的 soak 测试，堆内存、DOM 或监听器无限增长时 FAIL。没有控制台错误和网络请求。

## 已知限制

- soak 测试是把时间加速跑 800 次场景切换，不等于在设备上跑几天，也测不到 GPU 内存、驱动和屏幕。活动之前，在真实的播放设备上跑几天。
- 页面重启不了崩溃的渲染进程，也发现不了自己卡死的主线程，所以浏览器之外必须有守护进程。上面的 systemd unit 只是起点，没有在真实的播放设备上跑过。
- wake lock 只是建议。设备上也要关闭熄屏和节能。
- 排期准不准，取决于设备时钟准不准。
- 内存重新加载只在 Chromium 里有效。
- 防烧屏措施只能降低风险，不能消除风险。
- 数据过期和暂停的提示只有中文，写了 `lang: 'en'` 也一样。
