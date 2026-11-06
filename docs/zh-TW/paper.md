<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->
# 報告與履歷

簡報之外，同一套工具還能寫 A4 文件。一份原始檔同時產出三樣東西：可以滾動閱讀的網頁、和列印結果一致的 A4 分頁檢視，以及 PDF。

```bash
npx pcafe paper new q3-review            # 報告
npx pcafe paper new my-cv --resume       # 履歷
npx pcafe paper dev q3-review            # 預覽
npx pcafe paper check q3-review          # 型別檢查、建置、QA、PDF，最後一行是 PASS 或 FAIL
npx pcafe paper build q3-review          # 輸出 dist/q3-review.html 和 dist/q3-review.pdf
```

檔案放在 `src/papers/<name>/index.tsx`。寫完要跑到 `PASS`，並逐頁看過 `qa/<name>/page-NN.png`。

## 報告

`ReportDef.blocks` 是從上到下的一列版塊。分頁自動完成，不用手動排。

| 版塊 | 用途 | 跨頁規則 |
| --- | --- | --- |
| `Cover` | 封面，獨佔一頁 | 不跨頁 |
| `Toc` | 目錄，頁碼自動填寫 | 不跨頁 |
| `H1` `H2` | 自動編號的標題 | 不會單獨留在頁底 |
| `P` | 正文，支援 `**粗體**`、`` `程式碼` ``、`[^來源]`、`[文字](網址)` | 在行之間分開，每邊至少兩行 |
| `List` | 列表 | 在條目之間分開 |
| `Stats` | 2–4 個關鍵數字，`source` 必填 | 不跨頁 |
| `Figure` | 帶編號的圖，`source` 必填 | 不跨頁 |
| `Table` | 帶編號的表，`source` 必填，閱讀檢視可排序 | 超過 12 行才跨頁，並重復表頭 |
| `Callout` | 重點框 | 不跨頁 |
| `Steps` | 3–5 步的步驟條，放在細節之前，先給全貌 | 不跨頁 |
| `Chat` | 手搓的聊天視窗，標著「示意介面」，`caption` 必填 | 不跨頁 |
| `Apps` | 1–3 個填好內容的應用面板，標著「示意介面」，`caption` 必填 | 不跨頁 |
| `SlidePage` | 把任意投影片範本放進一張橫向頁 | 獨佔一頁 |
| `SourceList` | 按 `[^key]` 首次出現的順序產生來源列表 | 在條目之間分開 |
| `PageBreak` | 強制換頁 | |

圖表：`DocLine` 折線、`DocBars` 排名條、`DocStack` 百分比條、`DocArea` 百分比面積。它們的文字總是真實字號，所以手機上也看得清。

投影片範本是為投影設計的，字號相對頁面很大，直接縮排 A4 縱向一欄會小到看不清，所以報告裡的圖用上面四種，大圖表才用 `SlidePage`。

**網頁閱讀版**：寫 `view: 'read'`，報告預設以網頁文章開啟：欄更寬、開頭更大，手機和電腦都好讀，仍然可以切到紙張檢視或存成 PDF。適合產品介紹、專案復盤、對外分享。配合 `Steps`、`Chat`、`Apps` 用介面代替文字描述（思路來自 oil-html，MIT）。範例：`src/papers/web-guide`。

引用寫成 `[^key]`，在 `sources` 裡登記，文末用 `<SourceList />` 列出。引用了沒登記的來源，QA 直接判 FAIL。

## 履歷

`ResumeDef` 只有資料，換 `layout` 和 `theme` 就換了樣子，內容不用動。

| `layout` | 適合 |
| --- | --- |
| `classic` | 單欄。最穩妥，投遞系統也最容易讀取 |
| `sidebar` | 深色側欄放聯絡方式和技能，適合經歷較多的人 |
| `banner` | 彩色頁頭帶關鍵數字，適合有明確成果的人 |
| `ledger` | 日期放在頁邊，大字號姓名，適合設計和內容崗位 |
| `showcase` | 工牌、關鍵數字趨勢、職業軌跡和成果對比，適合產品和營運 |
| `console` | 真實的終端元件放在深色頁頭，加指標儀表和技術熱力格，適合工程師 |
| `portfolio` | 第二頁放真實簡報頁面的縮圖，適合設計和內容崗位 |

這三種版式用了元件，額外的板塊型別是 `track`（職業軌跡，從第一段工作經歷產生）、`impact`（前後對比）、`heat`（使用年份）、`gauges`（指標儀表）和 `projects`（專案卡片）。`badge` 和 `terminal` 寫在 `ResumeDef` 頂層，趨勢寫在 `highlights[].trend`。

每份這樣的履歷都能產生投遞版：頁面頂部切換，或者開啟時加 `?plain=1`。同一份資料變成單欄文字，元件內容轉成列表，放不下的板塊自動移到第二頁。`paper build` 會同時輸出 `dist/<name>-plain.pdf`，網申系統請用這個檔案。

規則：

- 放不下就刪內容，或者給板塊寫 `page: 2` 放到第二頁，最多兩頁。字號不會自動縮小。
- 內容少時，段距會自動放寬，讓頁面看起來舒展。
- 不要用技能百分比條，這種數字對讀者沒有意義。
- `highlights` 只寫面試時講得清楚的數字。
- `note` 用來標註範例，真實履歷不要寫。

## QA 檢查什麼

文字是否超出紙張或正文區、標題是否落單、引用是否都有來源、圖表是否都有出處、最小字號不低於 8pt、PDF 頁數與分頁檢視一致、字型已嵌入、PDF 文字可以提取、履歷不超過兩頁、閱讀檢視在手機上不橫向滾動。

## 已知限制

- 目前只有 A4 一種紙張。
- Chrome 產生的 PDF 把這些字型嵌成 Type 3。文字可以選中和複製，列印也是向量，但個別 PDF 閱讀器裡螢幕顯示可能略細。
- `sidebar`、`banner`、`showcase`、`console` 和 `portfolio` 是多欄版式，投遞系統提取文字的順序可能和視覺順序不同。要過自動篩選時用 `classic` 或投遞版。
