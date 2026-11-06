# 动画视频

把同样的 React 场景渲染成 MP4，在虚拟时钟上逐帧生成。全程不录屏：在同一台机器和同一个 Chromium 版本上，跑得慢和跑得快得到的帧相同。

```bash
npx pcafe video new my-video         # 生成 src/videos/my-video/index.tsx
npx pcafe video dev my-video         # 预览
npx pcafe video check my-video       # 类型检查、渲染、QA，最后一行是 PASS 或 FAIL
npx pcafe video build my-video       # 输出 dist/video/my-video.mp4 和 .frames.json
```

文件放在 `src/videos/<name>/index.tsx`。写完要跑到 `PASS`，并看过 `qa/video/<name>/contact.png`，再用 `--still` 看关键时刻的原尺寸画面：动画进行到一半、场景结束、转场当中。

`check` 需要 PATH 里有 `ffmpeg` 和 `ffprobe`，还需要 Playwright 的 Chromium（`npx playwright install chromium`），依次运行类型检查 → 渲染 → QA。首次运行若没装浏览器，会打印这条安装命令并以非零状态退出。检查和构建都不再需要 Python 或系统字体：CJK 子集随仓库提交，`npm run fonts:verify` 负责校验；`npm run fonts` 只给维护者重新生成子集。`build` 不跑 QA，所以要在 `check` 之后用，不能代替它。

预览时，空格键播放和暂停，← 和 → 逐帧移动，竖版视频按 S 显示安全区。预览和渲染用的是同一套时钟和场景。如果算一帧的时间比一帧的时长还长，预览会比实际慢。

CLI 没有覆盖的功能，直接调用脚本：

```bash
node scripts/video-render.mjs my-video --still 1.5,7.25       # PNG 静帧，放在 qa/video/my-video/
node scripts/video-render.mjs my-video --from 12 --to 18      # 只渲染一段，输出 dist/video/my-video.part.mp4
node scripts/video-render.mjs my-video --audio track.m4a      # 加入一条你有权使用的音轨
node scripts/video-selftest.mjs                               # 验证这台机器上的捕获能做到帧准确
```

`check` 会清空 `qa/video/<name>/`，所以静帧要在它之后再取。升级 Chromium 或 Motion 后要跑一次 selftest，它的最后一行是 PASS 或 FAIL。

## 一个视频

```tsx
import { LineChart } from '../../kit'
import type { VideoDef } from '../../video'

export const video: VideoDef = {
  title: '标题',
  size: '16:9',          // 或 '9:16'
  fps: 30,               // 默认值；可选 24、25、30、50、60
  theme: 'amber',
  style: 'mono-studio',
  transition: 'fade',    // cut、fade、push、wipe、rise
  preroll: 1,            // 第 0 帧之前已经播放的秒数，避免第一帧是空的
  scenes: [
    {
      id: 'growth',
      duration: 5,
      caption: '一句话，烧录进画面。',
      render: () => <LineChart {...props} source="数据从哪里来" />,
    },
  ],
}
```

`SceneDef`：

| 字段 | 用途 |
| --- | --- |
| `duration` | 从这个场景开始到下一个场景开始的秒数 |
| `render` | 一个 kit 模板（16:9），或一个竖版场景（9:16） |
| `caption` | 整个场景一句字幕的字符串，或 `[{ at, to?, text }]` |
| `steps` | 每组 `data-build` 出现的秒数，每组一项 |
| `build` | `reveal`（默认）或 `focus` |
| `transition`、`transitionTime` | 这个场景如何进入，默认 0.5 秒 |
| `tone` | `dark`、`accent` 或 `light`，规则和幻灯片相同 |
| `source` | 9:16 场景的来源行。kit 模板自己会显示 |
| `noFacts` | 不陈述事实的标题卡，QA 不再要求来源 |
| `maxHold`、`minHold` | 最长静止时间（3.5 秒）和切换前的最短静止时间（0.8 秒） |

每个事实都要在画面上写明出处，估算和示意要标明，规则和幻灯片相同。查不到出处的事实不要写。

16:9 里带字幕的场景，幻灯片通过 `--u` 按 90% 绘制，字幕放在下方的字幕带里，所以文字依然清晰。

## 竖版

kit 模板是 1920×1080，不会重新排版。把幻灯片加黑边塞进竖版画面，手机上的文字就小到看不清了，所以 9:16 场景使用 `src/video/portrait.tsx` 里的部件：

| 部件 | 用途 |
| --- | --- |
| `Tall` | 场景主体外的小标题和标题 |
| `HeroNumber` | 一个滚动计数的超大数字和一句说明 |
| `DrawnLine` | 边画边走的折线，读数跟着线头移动 |
| `Waffle` | 100 个格子，每格代表 1%，逐年填充 |
| `RankBars` | 依次增长的排名条 |
| `Slides` | 同一坐标轴上的前后对比 |
| `TallClose` | 结尾卡 |
| `Count` | 用在自己版式里的计数数字 |

每个值都由 `useSceneTime()` 算出，所以部件在任何一帧都有确定的状态。新部件用 `src/video/anim.ts` 里的工具函数，并且只读这个 hook。纯函数能做到的，就不要在竖版部件里启动 Motion 或 CSS 动画。

文字必须留在 `PORTRAIT_SAFE` 内（1080×1920 上方 270、右侧 216、下方 500、左侧 60）。我们查过的平台都没有公布能读到的数字，所以这是根据社区数据取的保守估算，见代码仓库的 `plans/research-video.md`。投放付费广告之前，到真实的 App 里确认。

## QA 检查什么

- ffprobe：H.264 High、yuv420p、BT.709 矩阵、原色、传输特性和有限范围，准确的帧率、尺寸、帧数和时长，`moov` 在 `mdat` 之前，只有要求时才有音频
- 在编码后的文件里查：连续空白、第一帧或最后一帧空白、画面冻结、转场时的亮度闪烁
- 用帧哈希查节奏：静止不超过 `maxHold`，切换前结束状态至少停留 `minHold`，每次切换画面都有可见变化
- 在浏览器里查：字幕溢出、超过 2 行、长度（34 个字符，9:16 为 32）、阅读速度（每秒 9 个字符）、文字超出安全区、文字太小（小于 15 px，9:16 为 24 px）、有事实的场景都有来源、build 步骤和 build 分组对得上、场景结束时没有内容还藏着
- `qa/video/<name>/` 里有联系表和每个场景的最后一帧

## 音频

场景本身不发声。`--audio file` 把一条音轨封装成 AAC、48 kHz 立体声，按视频长度截断，最后一秒淡出。要改这部分，看 `scripts/video-render.mjs` 里的 `encoder()`。人声和场景不会自动同步，要自己调整场景时长去配合音轨。

`video check` 和 `video build` 渲染时不带音频，并且会覆盖 MP4，所以加音频要放到最后一步。要检查这个文件，接着运行 `node scripts/video-qa.mjs my-video`。

## 已知限制

- 只有在同一台机器和同一个 Chromium 版本上帧才完全相同，CPU 被限速时也是如此。其他机器可能会用不同的方式光栅化文字。只测过 Linux arm64。
- `<video>`、canvas 动画、SMIL 和 GIF 不受虚拟时钟控制。
- 不是所有 kit 模板都渲染成视频测过，只测过示例和 selftest 里用到的那些。
- 只有 16:9 和 9:16，只能有一条音轨，人声和字幕不同步。
- 竖版安全区是保守估算，不是任何平台给出的数字。
