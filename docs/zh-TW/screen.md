<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->
# 展示螢幕

迴圈播放的全屏頁面，用在活動大螢幕、店鋪櫥窗或展廳。它的設計目標是無人值守連續執行多天，限制見文末的「已知限制」。和簡報一樣，它是一個離線 HTML 檔案。

規則為什麼是這樣，以及出處：程式碼儲存庫的 [`plans/research-screen.md`](../../plans/research-screen.md)。

## 做一個展示螢幕

```bash
npx pcafe screen new my-hall         # 產生 src/screens/my-hall/index.tsx
npx pcafe screen dev my-hall         # 預覽
npx pcafe screen check my-hall       # 型別檢查、建置、QA，最後一行是 PASS 或 FAIL
npx pcafe screen build my-hall       # 輸出 dist/screen/my-hall.html
```

寫完要跑到 `PASS`，並看過 `qa/screen/my-hall/` 裡的每張圖。

`check` 需要 Playwright 的 Chromium（`npx playwright install chromium`），依次執行型別檢查 → 建置 → QA。首次執行若沒裝瀏覽器，會列印這條安裝指令並以非零狀態退出。檢查和建置都不再需要 Python 或系統字型：CJK 子集隨儲存庫提交，`npm run fonts:verify` 負責校驗；`npm run fonts` 只給維護者重新產生子集。`build` 不跑 QA，所以要在 `check` 之後用，不能代替它。

```tsx
import { BigNumber, Hero, defineScreen } from '../../screen'

export const screen = defineScreen({
  title: '我的展廳',
  theme: 'cobalt',
  face: 'editorial',                  // editorial | grotesk | heavy
  atmosphere: 'stars',                // stars | grid | none
  orientation: 'landscape',           // landscape | portrait | both
  venue: { diagonalIn: 98, distanceM: 5, baselineM: 1.4, panel: 'lcd' },
  clock: { date: true },
  reloadAt: '04:30',
  scenes: [
    { id: 'open', label: '開場', seconds: 12, render: () => <Hero title={['一個資訊']} source="來源：…" /> },
  ],
})
```

## 字號由場地決定

`venue` 必填。寫明螢幕大小（`diagonalIn`，LED 牆用 `longEdgeMm`）、希望從多遠讀到（`distanceM`）、文字離地多高（`baselineM`）。引擎據此算出所有字號，所以**沒有哪個範本能設定字號**。欄位放不下，就刪字或拆場景。

QA 測量字形的真實高度：

| 文字 | 規則 |
|---|---|
| 拉丁字母、數字 | 2010 ADA Standards Table 703.5.5，按大寫 I 測量 |
| 中文 | 同一數值 × 1.54（Zhang et al. 2020） |
| 小字（來源、署名） | 在 `nearM`（預設 1.5 米）處 16 弧分，且至少 20 設計 px |

舉例：98 英寸螢幕從 5 米讀，中文字號約 80 設計 px。5 米寬的 LED 牆從 10 米讀、安裝位置較高時，約 77 設計 px。

## 範本

每個範本都有自己的橫式和直式版式。下表的上限針對範例場地，真正的上限以你的場地下 QA 的結果為準。

| 範本 | 用途 | 欄位 |
|---|---|---|
| `Hero` | 一個資訊 | `kicker?`、`title[]`（≤ 3 行）、`portraitTitle[]?`、`sub?`、`art?`、`source`、`credit?` |
| `BigNumber` | 一個數字 | `kicker?`、`value`（≤ 7 個字元）、`unit?`、`label`、`note?`、`art?`、`source`、`credit?` |
| `Moments` | 3–5 個事件，依次點亮 | `kicker?`、`title[]`、`items[{ when, at?, label }]`、`source` |
| `Quote` | 某人說過的一句話 | `kicker?`、`lines[]`、`original?`、`by`、`source` |
| `Pair` | 兩半，後一半是落點 | `kicker?`、`items[2]{ big, small }`、`source` |
| `Board` | 固定的小表格 | `kicker?`、`title`、`rows[{ left, right }]`（≤ 5）、`source` |
| `NowNext` | 正在進行和下一場，由時鐘決定 | `source` |
| `Agenda` | 今日議程，由時鐘決定 | `title?`、`source` |

`art` 寫成 `{ src, mode: 'disc' | 'ground' }`，`src` 是用 import 引入的 `decor-` 或 `photo-` 圖片，並在 `credit` 裡寫明。

中文可以在任意兩個字之間換行，所以較長的 `sub` 或 `note` 可能把片語拆開。要保持完整，用 JS 字串寫換行：`sub={'第一句，\n第二句。'}`。普通的 `sub="..."` 屬性裡，JSX 會把 `\n` 當成字面文字。議程標題來自資料，不能寫換行，要寫得足夠短，或者檢查直式的 `NowNext`，那裡會以最大字號換行。

不要嵌入 kit 投影片。它們的正文字號是給坐在屋裡的人設計的，在任何真實的展示螢幕場地都過不了距離規則。

## 內容規則

- 一個場景一個資訊。三個數字就是三個場景。
- `source` 必填，以小字顯示。查不到出處的事實不要寫。
- 虛構資料：在螢幕上設定 `sample`。它以正文字號顯示在每個場景上，任何場景缺了它 QA 都會 FAIL。
- `seconds` 要夠讀完：2 秒 + 字元數 ÷ 每分鐘 260 + 單詞數 ÷ 每分鐘 238，最少 6 秒。

## 時間

`timezone` 是 IANA 名稱，不寫就用播放裝置自己的時區。下面的內容都跟隨它。

```tsx
{ id: 'lunch', label: '午餐', seconds: 9, when: { from: '12:00', to: '13:30' }, render: … }  // 只在這段時間播放
{ when: { from: '22:00', to: '02:00' } }                                      // 跨午夜
{ when: [{ from: '09:00', to: '18:00', days: [1, 2, 3, 4, 5] }] }             // 工作日；0 是週日
{ when: { from: '08:00', to: '20:00', dates: ['2026-11-14'] } }               // 某一天
```

要顯示正在進行和下一場，寫 `agenda: (data) => sessions`。每場有 `start`、`end`、`title`、`who?`、`room?`、`date?`、`isBreak?`。`NowNext`、`Agenda` 和 `items` 為函式的 `ticker` 都跟隨時鐘，不需要重新載入。`states` 列出 QA 要拍照的時刻。

## 即時資料

```tsx
data: { initial: SAMPLE, parse: parseEvent, everySec: 30, staleAfterSec: 120, source: 'event-data.js' }
```

設定 `source`，或者在 URL 裡寫 `?data=`。

- **本地檔案**必須是放在頁面旁邊的 `.js` 檔案，用相對路徑。內容是一次呼叫：`window.__screenData({ ... })`。從 `file://` 開啟的頁面讀不了 JSON。
- **URL** 必須返回 JSON，如果頁面在 `file://` 上，還要允許 CORS。遠端 `.js` 會被拒絕，因為它會在頁面裡作為程式碼執行。

`parse` 遇到格式錯誤的內容應該丟擲異常：上一份正確的資料會保留，重新整理後也還在。超過 `staleAfterSec` 沒有拿到正確資料時，螢幕上顯示 `資料已過期 · 最後更新 14:32`，資料恢復後消失。

## 安裝

把這一個 HTML 檔案複製到播放裝置，然後：

```bash
# Linux 或樹莓派。引數來自樹莓派的 kiosk 教程。
chromium --kiosk --noerrdialogs --disable-infobars --no-first-run --start-maximized \
  "file:///home/signage/my-hall.html"
```

**瀏覽器之外必須有一個守護程序。** 頁面能接住自己的錯誤，但重啟不了崩潰的渲染程序，也發現不了自己卡死的主執行緒。下面的 unit 只是起點，沒有在真實的播放裝置上跑過；使用者服務還需要你的圖形會話環境，所以活動之前要測試，包括拔電源。

```ini
# /etc/systemd/user/signage.service
[Service]
ExecStart=/usr/bin/chromium --kiosk --noerrdialogs --disable-infobars --no-first-run --start-maximized file:///home/signage/my-hall.html
Restart=always
RestartSec=5
[Install]
WantedBy=default.target
```

裝置上還要做這些：

- 在作業系統裡關閉螢幕熄滅和 DPMS，關閉螢幕自帶的節能定時器。頁面會請求 wake lock，但瀏覽器只把它當成建議。
- 把螢幕的畫面尺寸設為 1:1 / Just Scan / 不過掃描。
- 讓系統時鐘通過 NTP 同步。排期準不準，取決於裝置時鐘準不準。
- 樹莓派要開啟 overlay 檔案系統，這樣斷電不會損壞儲存卡。
- 豎裝螢幕：儘量在作業系統裡旋轉。做不到的話，在 URL 加 `?rotate=90` 或 `?rotate=270`。螢幕可以往哪邊轉，查說明書，各廠商不一樣。

## 操作按鍵

不按鍵時什麼都不顯示。滑鼠指標是隱藏的。

| 按鍵 | 作用 |
|---|---|
| `F` | 全屏 |
| `Space` | 暫停，10 分鐘後自動繼續 |
| `N` / `→`，`P` / `←` | 下一個，上一個 |
| `I` | 狀態：時鐘、執行時長、記憶體、wake lock、資料、錯誤日誌 |
| `R` | 重新載入 |

## URL 引數

| 引數 | 含義 |
|---|---|
| `?now=14:30`，`?now=2026-11-14T14:30` | 讓螢幕時鐘假定現在是這個時間 |
| `?speed=60` | 讓時間跑快，用來預覽 |
| `?pin=<scene id>` | 停在一個場景上 |
| `?rotate=90` | 在沒有旋轉的輸出上旋轉畫面 |
| `?data=<路徑或 url>` | 資料來源 |

## 出問題時會怎樣

| 故障 | 行為 |
|---|---|
| 場景丟擲異常或什麼都沒渲染 | 記錄並跳過，不會黑屏。休息 5 分鐘，翻倍直到 1 小時，然後再試 |
| 所有場景都失敗，或者沒有場景在排期內 | 顯示帶標題的等待卡，每 30 秒重試 |
| 找不到責任場景的錯誤 | 記錄，迴圈繼續 |
| 資料輪詢失敗或格式錯誤 | 上一份正確的資料保留。退避到 10 分鐘一次。到設定時間後顯示過期提示 |
| 堆記憶體超過 `memoryLimitMb`（預設 400） | 在下一次場景切換時重新載入，30 分鐘內最多一次。僅限 Chromium |
| `reloadAt` | 每天在下一次場景切換時重新載入一次。通過 http 提供時，只有 `HEAD` 檢查成功才會載入 |
| 渲染程序崩潰或卡死，或者機器重啟 | 頁面無能為力：這是守護程序的工作 |

## 烙印

底色接近純黑，不用純白。時鐘、名稱和來源每次切換場景時移動幾個畫素，每 10 分鐘左右互換（`burnIn: { flipMinutes, shift }`）。`panel: 'oled'` 把移動幅度加倍，`'led'` 關閉移動。如果完整迴圈一遍後，螢幕上有超過 1% 的區域始終高於 25% 亮度，QA 會 FAIL。這只能降低風險，不能消除風險。比如 LG 的 B2B 保修不包括殘影。請讀你自己的保修條款。

## QA 檢查什麼

`scripts/screen-qa.mjs` 針對建置好的檔案執行，按 `orientation` 在 1920×1080 和 3840×2160，和/或 1080×1920 和 2160×3840 上檢查：

溢位、裁切、重疊和 90% 安全區。按字形檢查文字大小是否符合場地。相對真實畫素的對比度至少 4.5:1。回退到系統字型。來源是否存在，範例標註。每個場景的時間。每個時間視窗的邊界和即時時鐘翻轉。場景丟擲異常、在 effect 裡失敗、什麼都沒渲染。所有場景失敗，然後恢復。非同步錯誤。操作按鍵。資料來源、錯誤資料、檔案缺失、過期狀態、恢復、斷線期間重新載入、遠端腳本。夜間重新載入和記憶體重新載入。烙印畫素。800 次場景切換的 soak 測試，堆記憶體、DOM 或監聽器無限成長時 FAIL。沒有控制台錯誤和網路請求。

## 已知限制

- soak 測試是把時間加速跑 800 次場景切換，不等於在裝置上跑幾天，也測不到 GPU 記憶體、驅動和螢幕。活動之前，在真實的播放裝置上跑幾天。
- 頁面重啟不了崩潰的渲染程序，也發現不了自己卡死的主執行緒，所以瀏覽器之外必須有守護程序。上面的 systemd unit 只是起點，沒有在真實的播放裝置上跑過。
- wake lock 只是建議。裝置上也要關閉熄屏和節能。
- 排期準不準，取決於裝置時鐘準不準。
- 記憶體重新載入只在 Chromium 裡有效。
- 防烙印措施只能降低風險，不能消除風險。
- 資料過期和暫停的提示只有中文，寫了 `lang: 'en'` 也一樣。
