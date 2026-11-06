<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->
# 動畫影片

把同樣的 React 場景渲染成 MP4，在虛擬時鐘上逐幀產生。全程不錄屏：在同一台機器和同一個 Chromium 版本上，跑得慢和跑得快得到的幀相同。

```bash
npx pcafe video new my-video         # 產生 src/videos/my-video/index.tsx
npx pcafe video dev my-video         # 預覽
npx pcafe video check my-video       # 型別檢查、渲染、QA，最後一行是 PASS 或 FAIL
npx pcafe video build my-video       # 輸出 dist/video/my-video.mp4 和 .frames.json
```

檔案放在 `src/videos/<name>/index.tsx`。寫完要跑到 `PASS`，並看過 `qa/video/<name>/contact.png`，再用 `--still` 看關鍵時刻的原尺寸畫面：動畫進行到一半、場景結束、轉場當中。

`check` 需要 PATH 裡有 `ffmpeg` 和 `ffprobe`，還需要 Playwright 的 Chromium（`npx playwright install chromium`），依次執行型別檢查 → 渲染 → QA。首次執行若沒裝瀏覽器，會列印這條安裝指令並以非零狀態退出。檢查和建置都不再需要 Python 或系統字型：CJK 子集隨儲存庫提交，`npm run fonts:verify` 負責校驗；`npm run fonts` 只給維護者重新產生子集。`build` 不跑 QA，所以要在 `check` 之後用，不能代替它。

預覽時，空格鍵播放和暫停，← 和 → 逐幀移動，直向影片按 S 顯示安全區。預覽和渲染用的是同一套時鐘和場景。如果算一幀的時間比一幀的時長還長，預覽會比實際慢。

CLI 沒有覆蓋的功能，直接呼叫腳本：

```bash
node scripts/video-render.mjs my-video --still 1.5,7.25       # PNG 靜幀，放在 qa/video/my-video/
node scripts/video-render.mjs my-video --from 12 --to 18      # 只渲染一段，輸出 dist/video/my-video.part.mp4
node scripts/video-render.mjs my-video --audio track.m4a      # 加入一條你有權使用的音軌
node scripts/video-selftest.mjs                               # 驗證這台機器上的捕獲能做到幀準確
```

`check` 會清空 `qa/video/<name>/`，所以靜幀要在它之後再取。升級 Chromium 或 Motion 後要跑一次 selftest，它的最後一行是 PASS 或 FAIL。

## 一個影片

```tsx
import { LineChart } from '../../kit'
import type { VideoDef } from '../../video'

export const video: VideoDef = {
  title: '標題',
  size: '16:9',          // 或 '9:16'
  fps: 30,               // 預設值；可選 24、25、30、50、60
  theme: 'amber',
  style: 'mono-studio',
  transition: 'fade',    // cut、fade、push、wipe、rise
  preroll: 1,            // 第 0 幀之前已經播放的秒數，避免第一幀是空的
  scenes: [
    {
      id: 'growth',
      duration: 5,
      caption: '一句話，燒錄進畫面。',
      render: () => <LineChart {...props} source="資料從哪裡來" />,
    },
  ],
}
```

`SceneDef`：

| 欄位 | 用途 |
| --- | --- |
| `duration` | 從這個場景開始到下一個場景開始的秒數 |
| `render` | 一個 kit 範本（16:9），或一個直向場景（9:16） |
| `caption` | 整個場景一句字幕的字串，或 `[{ at, to?, text }]` |
| `steps` | 每組 `data-build` 出現的秒數，每組一項 |
| `build` | `reveal`（預設）或 `focus` |
| `transition`、`transitionTime` | 這個場景如何進入，預設 0.5 秒 |
| `tone` | `dark`、`accent` 或 `light`，規則和投影片相同 |
| `source` | 9:16 場景的來源行。kit 範本自己會顯示 |
| `noFacts` | 不陳述事實的標題卡，QA 不再要求來源 |
| `maxHold`、`minHold` | 最長靜止時間（3.5 秒）和切換前的最短靜止時間（0.8 秒） |

每個事實都要在畫面上寫明出處，估算和示意要標明，規則和投影片相同。查不到出處的事實不要寫。

16:9 裡帶字幕的場景，投影片通過 `--u` 按 90% 繪製，字幕放在下方的字幕帶裡，所以文字依然清晰。

## 直向

kit 範本是 1920×1080，不會重新排版。把投影片加黑邊塞進直向畫面，手機上的文字就小到看不清了，所以 9:16 場景使用 `src/video/portrait.tsx` 裡的部件：

| 部件 | 用途 |
| --- | --- |
| `Tall` | 場景主體外的小標題和標題 |
| `HeroNumber` | 一個滾動計數的超大數字和一句說明 |
| `DrawnLine` | 邊畫邊走的折線，讀數跟著線頭移動 |
| `Waffle` | 100 個格子，每格代表 1%，逐年填充 |
| `RankBars` | 依次成長的排名條 |
| `Slides` | 同一座標軸上的前後對比 |
| `TallClose` | 結尾卡 |
| `Count` | 用在自己版式裡的計數數字 |

每個值都由 `useSceneTime()` 算出，所以部件在任何一幀都有確定的狀態。新部件用 `src/video/anim.ts` 裡的工具函式，並且只讀這個 hook。純函式能做到的，就不要在直向部件裡啟動 Motion 或 CSS 動畫。

文字必須留在 `PORTRAIT_SAFE` 內（1080×1920 上方 270、右側 216、下方 500、左側 60）。我們查過的平台都沒有公佈能讀到的數字，所以這是根據社群資料取的保守估算，見程式碼儲存庫的 `plans/research-video.md`。投放付費廣告之前，到真實的 App 裡確認。

## QA 檢查什麼

- ffprobe：H.264 High、yuv420p、BT.709 矩陣、原色、傳輸特性和有限範圍，準確的幀率、尺寸、幀數和時長，`moov` 在 `mdat` 之前，只有要求時才有音訊
- 在編碼後的檔案裡查：連續空白、第一幀或最後一幀空白、畫面凍結、轉場時的亮度閃爍
- 用幀雜湊查節奏：靜止不超過 `maxHold`，切換前結束狀態至少停留 `minHold`，每次切換畫面都有可見變化
- 在瀏覽器裡查：字幕溢位、超過 2 行、長度（34 個字元，9:16 為 32）、閱讀速度（每秒 9 個字元）、文字超出安全區、文字太小（小於 15 px，9:16 為 24 px）、有事實的場景都有來源、build 步驟和 build 分組對得上、場景結束時沒有內容還藏著
- `qa/video/<name>/` 裡有聯絡表和每個場景的最後一幀

## 音訊

場景本身不發聲。`--audio file` 把一條音軌封裝成 AAC、48 kHz 立體聲，按影片長度截斷，最後一秒淡出。要改這部分，看 `scripts/video-render.mjs` 裡的 `encoder()`。人聲和場景不會自動同步，要自己調整場景時長去配合音軌。

`video check` 和 `video build` 渲染時不帶音訊，並且會覆蓋 MP4，所以加音訊要放到最後一步。要檢查這個檔案，接著執行 `node scripts/video-qa.mjs my-video`。

## 已知限制

- 只有在同一台機器和同一個 Chromium 版本上幀才完全相同，CPU 被限速時也是如此。其他機器可能會用不同的方式光柵化文字。只測過 Linux arm64。
- `<video>`、canvas 動畫、SMIL 和 GIF 不受虛擬時鐘控制。
- 不是所有 kit 範本都渲染成影片測過，只測過範例和 selftest 裡用到的那些。
- 只有 16:9 和 9:16，只能有一條音軌，人聲和字幕不同步。
- 直向安全區是保守估算，不是任何平台給出的數字。
