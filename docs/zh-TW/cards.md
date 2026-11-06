<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->
# 社交卡片

給社交平台用的圖文和封面。一份原始檔產出三樣東西：每張卡片一張 PNG，尺寸是平台要求的畫素；一個相簿頁面，可以看封面在資訊流裡的大小；LinkedIn 文件還會多出一份 PDF。

```bash
npx pcafe cards new solar-post       # 產生 src/cardsets/solar-post/index.tsx
npx pcafe cards dev solar-post       # 在相簿裡預覽
npx pcafe cards check solar-post     # 型別檢查、匯出、QA，最後一行是 PASS 或 FAIL
npx pcafe cards build solar-post     # 輸出 dist/cards/solar-post.html 和 dist/cards/solar-post/ 裡的 PNG
```

檔案放在 `src/cardsets/<name>/index.tsx`。寫完要跑到 `PASS`，並按原尺寸看過 `dist/cards/<name>/` 裡的每張 PNG，再看每張 `qa/cards/<name>/feed-NN-<preset>.png`，這是封面縮到估算的資訊流寬度後的樣子。

`check` 需要 Playwright 的 Chromium（`npx playwright install chromium`），依次執行型別檢查 → 匯出 → QA。首次執行若沒裝瀏覽器，會列印這條安裝指令並以非零狀態退出。檢查和建置都不再需要 Python 或系統字型：CJK 子集隨儲存庫提交，`npm run fonts:verify` 負責校驗；`npm run fonts` 只給維護者重新產生子集。`build` 不跑 QA，所以要在 `check` 之後用，不能代替它。

## 一組卡片

```tsx
import type { CardSetDef } from '../../cards'

export const set: CardSetDef = {
  title: '我的卡片',
  preset: 'xhs-portrait',      // 每張卡片的尺寸，單張可以用自己的 `preset` 覆蓋
  theme: 'cobalt',
  cards: [
    { t: 'cover', lines: ['三五個字', '說清鉤子'], mark: [1], hint: '左滑', source: null },
    { t: 'number', value: '2,779', unit: 'TWh', label: '這個數字是什麼', source: '發布方，年份' },
    { t: 'ending', lines: ['最後一張'], cta: '只提一個要求', source: null },
  ],
}
```

`CardSetDef` 還可以寫 `style`、`iconStyle`、`lang`（`zh` 或 `en`）、`handle`（每張卡片上的帳號名，≤ 14）和 `pages`（內頁頁碼）。

在相簿裡，「資訊流大小」按估算的資訊流寬度顯示每張封面，「安全區」在卡片上畫出安全區、遮擋條和裁切範圍。

## 尺寸預設

| `preset` | 位置 | 畫素 | 比例 | 依據 | 資訊流寬度 |
| --- | --- | --- | --- | --- | --- |
| `xhs-portrait` | 小紅書 直向 | 1080×1440 | 3:4 | community | 180 |
| `xhs-square` | 小紅書 方形 | 1080×1080 | 1:1 | community | 180 |
| `xhs-landscape` * | 小紅書 橫版 | 1440×1080 | 4:3 | community | 180 |
| `bili-wide` * | B站 封面 | 1920×1080 | 16:9 | conflict | 180 |
| `bili-mobile` * | B站 封面 | 1200×900 | 4:3 | unconfirmed | 180 |
| `douyin-cover` * | 抖音 封面 | 1080×1920 | 9:16 | community | 128 |
| `channels-portrait` * | 影片號 直向封面 | 1080×1260 | 6:7 | community | 128 |
| `channels-wide` * | 影片號 橫版封面 | 1080×608 | 16:9 | community | 128 |
| `wechat-head` * | 公眾號 頭條 | 900×383 | 2.35:1 | community | 350 |
| `wechat-thumb` * | 公眾號 次條 | 200×200 | 1:1 | community | 60 |
| `weibo-square` | 微博 九宮格 | 1080×1080 | 1:1 | community | 120 |
| `weibo-article` * | 微博 文章頭圖 | 980×550 | 16:9 | community | 350 |
| `ig-portrait` | Instagram 輪播 | 1080×1350 | 4:5 | community | 128 |
| `ig-tall` | Instagram 輪播 | 1080×1440 | 3:4 | community | 128 |
| `linkedin-doc` | LinkedIn 文件，同時輸出 PDF | 1080×1350 | 4:5 | community | 360 |
| `yt-thumb` * | YouTube 縮圖 | 1280×720 | 16:9 | official | 168 |
| `og-image` * | Open Graph | 1200×630 | 1.91:1 | official | 360 |
| `x-card` * | X 連結卡片 | 1200×628 | 1.91:1 | conflict | 360 |

\* 只作封面：這個預設上的每張卡片都要過資訊流檢查。資訊流寬度的單位是 390 px 寬手機上的 CSS px，每個值都是估算。

「依據」的含義：

- `official`：在平台自己的頁面或它的搜尋摘要裡讀到。`yt-thumb` 只有比例和最小寬度是官方的，1280×720 和右下角的時長位置來自第三方。`og-image` 的 Meta 頁面只讀到了搜尋摘要。
- `community`：第三方指南說法一致，平台沒有確認。
- `conflict`：來源矛盾，這個值是我們的選擇。B站的來源有 16:9、16:10 和 4:3，所以 `src/cardsets/solar-bili` 匯出了兩種尺寸。
- `unconfirmed`：只有一個來源，或者是我們自己的觀察。

每個值的依據寫在程式碼儲存庫的 `plans/research-cards.md`。平台隨時可能改規格，要依賴某個值之前，先到 App 裡確認。

## 範本

| `t` | 用途 | 欄位與上限 | 形狀 |
| --- | --- | --- | --- |
| `cover` | 大字封面 | `lines` 1–3 行，`mark`，`sub` ≤ 24，`motif`，`hint` ≤ 8 | 超長、直向、方形 |
| `wide` | 寬比例封面 | `lines` 1–2 行（16:9 每行 ≤ 8，`wechat-head` 每行 ≤ 4），`mark`，`sub` ≤ 20，`motif`，`align` | 橫版、寬版、橫幅 |
| `number` | 一個數字就是重點 | `value` ≤ 7，`unit` ≤ 6，`label` ≤ 22，`note` ≤ 40，`bars` | 除橫幅外都可以 |
| `chart` | 一張圖和它證明的一句話 | `title` ≤ 22，`takeaway` ≤ 40，`chart` | 除橫幅外都可以 |
| `compare` | 2–3 項並排對比 | `title` ≤ 22，`items`（`label` ≤ 12，`value` ≤ 7，`unit`，`num`，`note` ≤ 22，`focus`），`verdict` ≤ 36 | 除橫幅外都可以 |
| `quote` | 一句有署名的話 | `text` ≤ 44，`by` ≤ 24 | 除橫幅外都可以 |
| `list` | 要點 | `title` ≤ 22，`items`（`head` ≤ 14，`body` ≤ 40，`icon`）：直向 3–5 條，方形和 4:3 為 3 條 | 超長、直向、方形、橫版 |
| `steps` | 有先後的步驟 | `title` ≤ 22，`steps`（`head`、`body`）：直向 3–4 步，方形 3 步 | 超長、直向、方形 |
| `text` | 圖表說不清的觀點 | `title` ≤ 22，`paras` 1–3 段，每段 ≤ 70 | 超長、直向、方形 |
| `image` | 截圖、照片或裝飾圖 | `image`，`title` ≤ 22，`caption` ≤ 40 | 超長、直向、方形 |
| `ending` | 最後一張 | `lines` 1–2 行，每行 ≤ 8，`mark`，`takeaways` 0–3 條，每條 ≤ 24，`cta` ≤ 22，`sources` 0–3 條，每條 ≤ 44 | 超長、直向、方形 |

封面的 `motif` 有三種：`{ kind: 'bars', values }`、`{ kind: 'icon', icon }`，以及貼紙式的 `{ kind: 'emoji', e: '🎤', around: ['✨', '💡'] }`。任何文字欄位也都可以直接打 emoji，見 [guide](guide.md) 的 Emoji 一節。

每張卡片還有 `source`（≤ 44，或者 `null`）、`kicker`（≤ 14）、`tone`（`paper`、`ink`、`accent`、`wash`）、`preset` 和 `cover`。

形狀：超長是 9:16，直向到 6:7 為止，橫版是 4:3，寬版到 2:1 為止，橫幅比這更寬（`wechat-head`）。範本用在沒有對應版式的形狀上，QA 會點名報錯。

`chart` 可以是 `line`（1–3 條線）、`bars`（≤ 12 根）或 `rank`（直向 ≤ 8 行，方形和寬版 ≤ 5 行，名稱 ≤ 6）。

## 規則

- 上限這樣算：一個漢字算 1，一個英文字母或數字算 0.5。QA 會數標題、正文欄位、`kicker` 和 `source`。大標題不計數，它的字號由最長一行決定，太小時 QA 判 FAIL。正文不會自動縮小，放不下就刪字或拆卡片。
- 封面大標題每行放得下的字數：小紅書約 6 個漢字，抖音和其他三列宮格約 5 個，`wechat-thumb` 只有 2–4 個。每一處換行都自己定。不要重複帖子標題，平台通常已經把它印在封面旁邊。
- 第一張是封面，標了 * 的預設上每張都是封面。封面必須有大標題，所以只能用 `cover`、`wide` 或 `number`。要在這種預設上放別的範本，給那張卡片寫 `cover: false`。
- 事實必須有出處。在 `source` 寫明發布方，算出來的數字要標明。只有不陳述事實的卡片才寫 `null`。QA 只能在卡片含有數字時發現缺出處，用文字寫的事實要自己查。查不到出處的事實不要寫。
- `quote` 的 `by` 必須是真實的署名，不要替別人編話。
- `image.kind` 遵守專案的圖片規則：`screenshot` 是你自己作品的截圖，可以當證據；`photo` 只營造氛圍，並印出 `credit`；`decor` 只做裝飾。

## QA 檢查什麼

文字是否超出卡片、進入安全區或壓在遮擋條下面。檔案裡的文字是否小於 10 px，全屏開啟時在手機上是否太小。最後一行是否只剩一個字。文字重疊、內容溢位、內容被裁掉、圖表被壓得太扁。內容上限。有數字沒出處、聲明瞭出處卻沒印在卡片上、照片沒有署名、圖片沒載入。把 PNG 縮到資訊流寬度後測量大標題的字號和對比度，以及大標題在居中裁切後是否還在。原尺寸的對比度。是否回退到系統字型。從檔案讀取每張 PNG 的準確畫素。PDF 頁數（需要安裝 `pdfinfo`）。相簿在手機上是否橫向滾動，頁面錯誤和網路請求。

結果在 `qa/cards/<name>/report.json`。

## 已知限制

- 這裡沒有一箇中國平台的規格得到官方確認。小紅書、抖音、影片號和 B站都沒有找到公開的官方頁面，試過的微信文件頁面返回 404。
- 資訊流寬度是估算，來自算術或觀察。大標題的最小字號（資訊流大小下 16 CSS px，`wechat-thumb` 為 14）是判斷，不是標準。安全區、遮擋條和居中裁切都是工作假設。
- 沒有在真實 App 裡發布測試過。第一次發布後要到 App 裡看一眼。
- QA 能發現一行只剩一個字，發現不了一個詞被拆到兩行，所以每張卡片還是要有人看。
