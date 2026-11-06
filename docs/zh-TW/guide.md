<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->
# 寫簡報：流程與規則

這份指南講怎麼用 PCafe 寫出一份合格的簡報：先排故事線，再給每頁配範本，把文字壓進範本的內容上限，最後跑檢查、看截圖。每個範本的具體欄位和上限見 [components.md](components.md)，放映與匯出見 [presenting.md](presenting.md)，新增範本和風格見 [contributing.md](contributing.md)。

章節編號是固定的，其他文件會用「第 8 節」「§13」來引用。

| 節 | 內容 |
| --- | --- |
| [0](#0-指令速查) | 指令速查 |
| [1](#1-工作流) | 工作流 |
| [2](#2-故事線) | 故事線 |
| [3](#3-我要表達什麼用哪個範本) | 我要表達什麼，用哪個範本 |
| [4](#4-建立一份簡報) | 建立一份簡報 |
| [5](#5-文案規則) | 文案規則 |
| [6](#6-視覺規則) | 視覺規則 |
| [7](#7-事實與來源) | 事實與來源 |
| [8](#qa-fixes) | QA 報錯怎麼修 |
| [9](#9-放映) | 放映（見 presenting.md） |
| [10](#bento) | 擴充套件：Bento 的小圖與詳情 |
| [11](#11-新增範本) | 新增範本（見 contributing.md） |
| [12](#icons) | 圖示 |
| [13](#themes) | 配色、深色頁、強調色整頁、風格 |
| [14](#build) | 逐條展開與翻頁銜接 |
| [15](#images) | 圖片 |

---

## 0. 指令速查

```bash
npx pcafe new my-deck       # 從起步範本產生 src/decks/my-deck/index.tsx
npx pcafe dev my-deck       # 開發預覽：#/1 放映，#/kit 看範本庫
npx pcafe check my-deck     # 型別檢查 → 建置 → 自動 QA，最後一行是 PASS 或 FAIL
npx pcafe build my-deck     # 產出 dist/my-deck.html（單檔案，離線可用）
npx pcafe docs              # 重新產生 components.md 和 skill 參考表
npx pcafe photos            # 下載可選的氛圍照片（見第 15 節）
```

`check` 的輸出裡會列印打包體積（其中約 3.6 MB 是內嵌字型）。最後一行是 `PASS — all deterministic checks` 才算通過；顯示 `FAIL (n)` 時按 [第 8 節](#qa-fixes) 修復後重跑。

---

## 1. 工作流

按順序做，不要跳步。

1. **收集事實**：把要講的每一個數字、日期、版本號連同出處整理好。查不到出處的事實不要寫。
2. **寫故事線**：先寫下「聽眾看完要記住的那一句話」，它就是最後一頁 `Closing` 的 `statement`。再按 [第 2 節](#2-故事線) 排出頁序（短版 6–8 頁，完整版 10–14 頁，分章的長版 20–30 頁），每頁寫一句該頁要證明的觀點。
3. **給每頁選範本**：用 [第 3 節](#3-我要表達什麼用哪個範本) 的決策表。同一個範本在一份簡報裡最多用兩次（`SectionBreak` 每章一次，不受此限），`Bento` 最多用一次。
4. **建 deck 檔案**：`npx pcafe new <name>`，見 [第 4 節](#4-建立一份簡報)。
5. **填內容**：每填完一頁，就對照 [components.md](components.md) 裡該範本的「內容上限」自查一遍。
6. **跑檢查**：執行 `npx pcafe check <name>`。只要出現 FAIL 就一定要修，修法見第 8 節。
7. **看一遍截圖**：`qa/slide-NN-1920x1080.png` 是每頁的截圖。逐頁確認沒有空白過多、一頁塞太滿、重點不突出等問題。

---

## 2. 故事線

一份好簡報是一條論證：**是什麼 → 有多大 / 多久 → 變了什麼 → 對你意味著什麼 → 怎麼做 → 接下來 → 結論**。下面三種結構可以直接套用。

### A. 版本 / 產品發布解讀（12 頁短版）

| # | 這一頁回答 | 範本 |
| --- | --- | --- |
| 1 | 這是什麼 | `Cover` |
| 2 | 全貌：六個最重要的變化 | `Bento` |
| 3 | 規模有多大 | `MetricBars` |
| 4 | 能用多久 / 時間點 | `Timeline` |
| 5 | 最顯眼的元件版本 | `SpotlightList` |
| 6 | 哪些預設行為變了 | `CompareTable` |
| 7 | 三四個同等重要的改進 | `NumberedColumns` |
| 8 | 誰該升級、誰該等 | `VerdictColumns` |
| 9 | 動手前要檢查什麼 | `Checklist` |
| 10 | 具體怎麼做 | `StepTrack` |
| 11 | 下一個版本 | `Teaser` |
| 12 | 一句話結論 | `Closing` |

### B. 專案 / 季度簡報（10 頁）

`Cover`（季度或專案代號）→ `MetricBars`（核心指標）→ `CompareTable`（目標 vs 實際）→ `Timeline`（里程碑）→ `NumberedColumns`（三項關鍵成果）→ `SpotlightList`（各團隊或通路資料）→ `VerdictColumns`（繼續 / 調整 / 停止）→ `StepTrack`（下季度計畫）→ `Teaser`（下一階段）→ `Closing`

### C. 技術方案評審（11 頁）

`Cover` → `Bento`（方案全貌）→ `CompareTable`（現狀 vs 方案）→ `NumberedColumns`（設計原則）→ `MetricBars`（效能或成本估算，標註「估算」）→ `Timeline`（遷移排期）→ `VerdictColumns`（適用 / 有條件 / 不適用的場景）→ `Checklist`（上線前檢查）→ `StepTrack`（遷移步驟）→ `Teaser`（後續演進）→ `Closing`

### D. 短版（6–8 頁，5 分鐘以內）

`Cover` → 一個資料頁（`MetricBars`、`Timeline` 或 `SpotlightList` 任選其一）→ `NumberedColumns` 或 `CompareTable` → `VerdictColumns` → `StepTrack` 或 `Checklist` → `Closing`。時間更緊時去掉中間任意一頁，但保留首尾。

### E. 分章知識簡報（20–30 頁）

適合培訓、研究綜述、行業簡報。先用 `Agenda` 列出 3–5 章，每章以 `SectionBreak` 開頭，章內 4–6 頁。

| # | 這一頁回答 | 範本 |
| --- | --- | --- |
| 1–2 | 這是什麼 / 分幾章 | `Cover` → `Agenda` |
| 章首 | 這一章講什麼 | `SectionBreak` |
| 概念 | 這個詞是什麼意思 | `QuoteHero` |
| 機制 | 它是怎麼運轉的 | `FlowDiagram` |
| 證據 | 一個關鍵數字 / 一組變化 / 兩種測法的差距 / 誤差有多大 | `BigStat` / `DeltaBars` / `Dumbbell` / `RangeBars` |
| 澄清 | 流傳的說法對不對 | `ClaimCards` |
| 排查 | 從外到內逐層要查什麼 | `LayerStack` |
| 對照 | 誰在哪一類裡叫什麼 | `Matrix` |
| 並列 | 6–8 個物件各有什麼特點 | `IconGrid` |
| 背景 | 事情是怎麼一步步來的 | `Milestones` |
| 計畫 | 接下來幾週做什麼 | `Gantt` |
| 收尾 | 每週 / 每月怎麼做，一句話結論 | `Checklist` → `Closing` |

### F. 業務 / 營運手冊（20–30 頁）

適合上市計畫、成長復盤、營運方案。行業數字寫出處；範例公司和它的數字一律在 `source` 裡標「示意」。

| # | 這一頁回答 | 範本 |
| --- | --- | --- |
| 1–2 | 這是什麼 / 分幾章 | `Cover` → `Agenda` |
| 客戶 | 買家怎樣決策、誰參與 | `BigStat` / `NumberedColumns` / `QuoteHero` → `PersonaCards` |
| 定位 | 和誰比、站在哪 | `FlowDiagram` → `Quadrant` |
| 定價 | 按什麼收、收多少 | `MetricBars` → `PricingTiers` |
| 執行 | 錢和時間怎麼分、誰負責 | `ShareBar` → `Gantt` → `StatusGrid` → `Matrix` |
| 衡量 | 漏在哪、指標怎樣、錢從哪來 | `Funnel` → `KpiBoard` → `Waterfall` |
| 成長 | 怎樣形成閉環 | `Cycle` |
| 收尾 | 上線前檢查、一句話結論 | `Checklist` → `Closing` |

技術發布解讀寫長版（20 頁以上）時，在 A 的基礎上加：`Agenda` + 每章 `SectionBreak`、`Milestones`（發布歷史）、`Cycle`（開發週期）、`StatusGrid`（平台支援）、`SpecSheet`（版本對照）、`CodeDiff`（設定格式變化）、`Terminal`（新指令）、`Faq`（升級問答）、`Lanes`（正在退場的功能）。

**節奏規則**

- 相鄰兩頁不要用同一個範本。
- 資料頁（`MetricBars`、`Timeline`、`SpotlightList`）和文字頁（`NumberedColumns`、`VerdictColumns`）儘量交替出現。短版裡至少放一個資料頁。
- 每頁只證明一個觀點。一頁放不下時拆成兩頁，不要壓縮字數硬塞。
- 長簡報裡，圖表頁（`BigStat`、`DeltaBars`、`Dumbbell`、`RangeBars`、`MetricBars`、`Funnel`、`Waterfall`、`ShareBar`、`KpiBoard`）之間至少隔一頁文字或圖示頁。

---

## 3. 我要表達什麼，用哪個範本

| 我手上的內容 | 用 | 不要用 |
| --- | --- | --- |
| 簡報的第一頁 | `Cover` | |
| 一句話結論，要單獨立住、給密集內容之間一個停頓 | `Statement` | 一份簡報超過 3 頁；句子超過 28 字 |
| 6 個並列主題，其中 1 個最重要，每個都有能展開講的圖或表 | `Bento` | 不足 6 個時不要湊數 |
| 2–4 個能放在一起比較大小的數量 | `MetricBars` | 單位不同的數字 |
| 起止日期、階段、支援期、排期 | `Timeline` | 只有一個日期 |
| 一組「名稱 → 數值」，其中一項是重點 | `SpotlightList` | 需要展示前後變化時 |
| 改版前 / 改版後，逐項對比 | `CompareTable` | 只有 1–2 處變化 |
| 3–4 個同等重要、沒有先後順序的要點 | `NumberedColumns` | 有先後順序時 |
| 「推薦 / 有條件 / 不推薦」的分組建議 | `VerdictColumns` | 沒有明確結論時 |
| 可以逐項打勾的準備工作，每項都有指令或動作 | `Checklist` | 有嚴格順序時 |
| 必須按順序完成的 3–5 步流程 | `StepTrack` | 超過 5 步 |
| 下一版本、下一階段、路線圖 | `Teaser` | 確定的結論 |
| 15 頁以上簡報的章節目錄 | `Agenda` | 10 頁以下 |
| 每章的第一頁 | `SectionBreak` | 沒有 `Agenda` 的短簡報 |
| 一個術語的定義，或一句有出處的原話 | `QuoteHero` | 超過 64 字的段落 |
| 系統或機制的運轉過程，其中一步是重點 | `FlowDiagram` | 聽眾要照做的步驟（用 `StepTrack`） |
| 一組流行說法，逐條給出結論與證據 | `ClaimCards` | 沒有出處的「闢謠」 |
| 層層依賴、要從外到內排查的環節 | `LayerStack` | 沒有先後關係的清單 |
| 物件 × 類別的短標識對照（廠商 × 用途） | `Matrix` | 格子裡要寫句子 |
| 6 或 8 個並列物件，各一兩句話 | `IconGrid` | 3–4 個（用 `NumberedColumns`） |
| 一個數字就是論點 | `BigStat` | 幾個數字同等重要 |
| 帶正負號的變化量 | `DeltaBars` | 都是正的總量 |
| 同一指標兩種條件下的值，差距是重點 | `Dumbbell` | 只有一種條件 |
| 估計值和它的誤差範圍 | `RangeBars` | 沒有誤差資料 |
| 以周或衝刺為單位的行動計畫 | `Gantt` | 有真實日期的長期週期（用 `Timeline`） |
| 4–7 個有日期的事件 | `Milestones` | 需要按時間比例表現間隔 |
| 3–4 條要在終端裡敲的獨立指令 | `Terminal` | 有先後依賴的流程（用 `StepTrack`） |
| 同一份設定或程式碼的新舊寫法 | `CodeDiff` | 只是幾個值變了（用 `CompareTable`） |
| 6–10 個物件各自的支援 / 就緒狀態 | `StatusGrid` | 每個物件要比多個維度（用 `Matrix`） |
| 一批元件的新舊版本號 | `SpecSheet` | 值是行為描述而不是版本號 |
| 首尾相接、會迴圈的階段 | `Cycle` | 只走一遍的流程（用 `FlowDiagram`） |
| 4 或 6 個常見問題，各一兩句回答 | `Faq` | 在核查說法真假（用 `ClaimCards`） |
| 按時間範圍分組的事項：現在 / 下一步 / 之後 | `Lanes` | 有確切日期（用 `Gantt`） |
| 逐級轉化的流程，要指出先修哪一級 | `Funnel` | 各級不是包含關係 |
| 兩個維度上的競爭定位 | `Quadrant` | 只比較一個維度 |
| 同一筆採購裡的三個角色 | `PersonaCards` | 三個細分市場（用 `IconGrid`） |
| 3–4 檔價格方案 | `PricingTiers` | 競品價格對比（用 `Matrix`） |
| 一個北極星指標加 4–6 個輸入指標 | `KpiBoard` | 只有 1–3 個數字 |
| 加起來是 100% 的構成，幾行對比 | `ShareBar` | 各部分不構成整體 |
| 從期初到期末的增減拆解 | `Waterfall` | 各項不是加減關係 |
| 4–12 個時間點的變化趨勢 | `LineChart` | 只有 2–3 個點（用 `MetricBars`） |
| 兩個維度交叉的數值：分批留存、通路 × 階段 | `Heatmap` | 只有一行或一列 |
| 一個要回答的問題，拆成 2–4 個互不重疊的分支 | `IssueTree` | 分支之間有先後順序（用 `FlowDiagram`） |
| 季度粒度的路線圖，帶進度 | `Roadmap` | 按周排期（用 `Gantt`） |
| 4、6 或 8 個人或角色，各自負責什麼 | `Team` | 要寫清每件事誰拍板（用 `Matrix` 做 RACI） |
| 3 或 5 句能逐字引用的原話 | `QuoteWall` | 只有一句（用 `QuoteHero`）；查不到原文 |
| 一張真實的產品截圖，要指出 3–5 個位置 | `Screenshot` | 沒有真實截圖 |
| 同一畫面兩種狀態的真實截圖 | `BeforeAfter` | 兩張圖構圖不同 |
| 封面要有記憶點，主題能用 4–8 個圖示概括 | `HangingCover` | 正式簡報（用 `Cover`） |
| 3–4 個功能，各配一小塊能看懂的介面（列表、大數字、柱、進度、換算、標籤） | `PanelCards` | 介面裡沒有真實資料 |
| 一個問題和三個並列答案，每個有數字和一組小柱 | `AskAnswer` | 答案不能用數字比較 |
| 一個承諾加證據：幾行引數、兩個數字、兩條保證 | `ProofSplit` | 證據少於兩條 |
| 4 個話題，一次講一個（配 `build: 'focus'`） | `IndexStack` | 話題需要同時對比 |
| 結尾留聯絡方式或入口，帶一個動作 | `ContactPanel` | 沒有可以給出的入口 |
| 一個核心和 4–8 個圍繞它的部件 | `Orbit` | 部件之間有先後順序（用 `FlowDiagram`） |
| 一個數字開場，後面一句話解釋它 | `NumberOpener` | 數字沒有出處 |
| 章節頁，要讓聽眾知道講到第幾章 | `ChapterProgress` | 少於 3 章 |
| 丟擲一個問題，下一頁回答 | `Question` | 一份簡報超過 2 頁 |
| 一句舊說法被一句新說法取代 | `Contrast` | 兩邊不是同一件事 |
| 一章或整份簡報的小結，3 條加「下一步」 | `Recap` | 超過 3 條 |
| 產品封面：深色主卡 + 一張真實截圖 + 2–3 條可核實的成績 | `HeroPanel` | 沒有真實截圖 |
| 同一產品的 2–4 張截圖，點分段切換 | `TabbedShot` | 截圖之間沒有關係 |
| 字型、顏色和尺寸規範 | `BrandKit` | 非設計話題 |
| 3–4 條有出處的獎項、評分或硬指標 | `Laurels` | 編不出出處的「榮譽」 |
| 一張真實截圖鋪滿整頁，配一句話（`tone: 'dark'`） | `FullBleed` | 截圖細節很多、需要標註（用 `Screenshot`） |
| 工作室風的致謝頁，列 2–4 個聯絡入口 | `Thanks` | 已經用了 `ContactPanel` |
| 創意或品牌提案的封面：兩個巨字 + 2–3 張真實截圖 | `SplitWord` | 正式簡報 |
| 等寬黑風格的章節頁 | `PillAgenda` | 少於 3 章 |
| 3–4 個並列的規模數字，可附一排工具名 | `StatRow` | 一個數字就是論點（用 `BigStat`） |
| 一個指標的前後兩個值，變化就是結論 | `CountCompare` | 超過兩個數 |
| 一個整體分成 2–5 部分，只強調一部分 | `Donut` | 超過 5 部分 |
| 2–8 個類別的數量，可分組或堆疊 | `BarChart` | 只有 2–4 個數（用 `MetricBars`）；時間趨勢 |
| 物件在兩個連續指標上的位置，可加第三個量 | `Bubble` | 只有兩個類別（用 `Quadrant`） |
| 一個值相對上限或目標 | `Gauge` | 沒有上限 |
| 4–6 件事，每件一個詞就能說清 | `ServiceList` | 每項要兩句以上 |
| 恰好三句有出處的原話 | `QuoteArc` | 查不到出處 |
| 3–4 個作品或方案，各一個詞 | `WorkCards` | 需要說明文字 |
| 等寬黑風格的結束頁 | `RepeatClosing` | 要列聯絡方式 |
| 輕鬆場合的封面，有一張真實截圖 | `StickerCover` | 正式簡報 |
| 4–10 個關鍵詞：技能、主題 | `WordBlocks` | 每項要解釋 |
| 3–4 個專案逐個講，各有截圖（配 `build: 'focus'`） | `FolderCards` | 要並排比較 |
| 3–4 個指標各帶一串歷史值 | `SparkCards` | 沒有歷史值（用 `StatRow`） |
| 比例說成「每 10 / 100 個裡有幾個」 | `Pictogram` | 部分超過 3 個 |
| 兩個時間點或兩種口徑下的名次 | `SlopeRank` | 要看具體數值（用 `Dumbbell`） |
| 貼紙風格的結束頁，帶一個行動號召 | `PixelClosing` | 正式場合 |
| 品牌或發布會封面，有一個代表數字 | `FloatCover` | 正式簡報 |
| 6 或 9 個功能、零件，各一個詞 | `TileWall` | 每項要解釋（用 `IconGrid`） |
| 3–4 個步驟或服務，各一兩句說明 | `ServiceIndex` | 步驟間要畫箭頭（用 `StepTrack`） |
| 目前這一項和下一項 | `GlowStack` | 超過兩項（用 `Roadmap`） |
| 兩個方案或兩種用法，各一個代表數字 | `DuoCards` | 三檔（用 `PricingTiers`） |
| 桌面風格的封面或目錄 | `Desktop` | 正式簡報 |
| 2–3 個步驟，各對應一個檔案或工具 | `WindowStack` | 超過 3 步 |
| 預設設定、功能開關 | `ToggleCard` | 要講狀態好壞（用 `StatusGrid`） |
| 層層依賴的前提條件 | `Pyramid` | 數量逐級減少（用 `Funnel`） |
| 兩三個維度的交集，定性 | `Venn` | 要比大小（用 `Donut`） |
| 從核心到外圍的包含關係 | `Concentric` | 平級的衛星（用 `Orbit`） |
| 按是 / 否條件選方案，最多兩層 | `DecisionTree` | 拆解原因（用 `IssueTree`） |
| 一個問題的 4–6 類成因 | `Fishbone` | 有層層因果（用 `IssueTree`） |
| 跨角色的流程和交接 | `Swimlane` | 只有一個角色（用 `StepTrack`） |
| 系統或組織的 3–5 層結構 | `ArchLayers` | 要講資料流（用 `FlowDiagram`） |
| 優缺點、成本與收益的權衡 | `Balance` | 逐項對比屬性（用 `CompareTable`） |
| 兩組物件經過同樣幾個階段 | `DoubleFunnel` | 只有一組（用 `Funnel`） |
| 發布會開場、新版本揭幕 | `KeyReveal` | 需要解釋細節：用 Cover |
| 產品規格、關鍵指標 | `KeySpec` | 要比較多個數：用 StatRow |
| 品牌、創意、功能發布的封面 | `OrbCover` | 正式簡報：用 Cover |
| 3 個並列的功能、開關、選項 | `GradientCards` | 有先後：用 StepTrack |
| 3–4 個同樣重要的數字 | `BlockStats` | 要比較大小：用 MetricBars |
| 封面、口號、規則宣講 | `PopPoster` | 需要論證：用 Statement |
| 產品或專案的一頁總覽 | `BentoBoard` | 要點選展開詳情：用 Bento |
| 介紹一個功能、一個檔案、一條指令 | `BentoSpotlight` | 多個並列功能：用 IconGrid |
| 評審、培訓、答疑這類要約時間的安排 | `SlotPicker` | 真實的長期排期：用 Gantt 或 Timeline |
| 上手、設定、建立這類三步流程 | `UiSteps` | 步驟帶指令且超過 3 步：用 StepTrack |
| AI、語音、工具類產品的開場 | `FloatHero` | 正式簡報：用 Cover |
| 引用一段錄音、訪談或講解 | `TranscriptCard` | 只有一句引語：用 QuoteHero |
| 按角色、階段、場景分組的清單 | `RetroTabs` | 只有一組：用 IconGrid |
| 版本更新、階段回顧 | `RetroLog` | 要按真即時間比例：用 Timeline |
| 有一個最想讓人記住的數字 | `GlowMetric` | 數字要對比：用 CountCompare |
| 4 或 6 個並列的功能、欄位、能力 | `HairlineGrid` | 每項一個詞就夠：用 TileWall |
| 培訓、活動、對外介紹的封面 | `RibbonCover` | 正式簡報：用 Cover |
| 分章的簡報，每章開頭 | `RibbonSection` | 不分章的短簡報 |
| 新手常見問題、使用者提問 | `ChatThread` | 問題超過 3 個且要標出處：用 Faq |
| 3–4 條規則、小貼士、注意事項 | `NoteCards` | 正式場合：用 NumberedColumns |
| 最後一頁 | `Closing` | |

找不到合適的範本時，**先改內容去適配範本**（拆頁、合併、換個角度），而不是去寫新的版式。

---

## 4. 建立一份簡報

```bash
npx pcafe new my-deck
```

這會把起步範本 `src/decks/starter/` 複製成 `src/decks/my-deck/index.tsx`。起步範本只依賴 `src/kit`，產生後就能編譯。需要別的範本時，到 [components.md](components.md) 裡找對應範本的範例，或者從 `src/decks/` 下的範例簡報裡複製那一頁的 `{ id, label, render }` 整塊再改內容。不要整份複製使用了 Bento 的範例：它依賴同目錄下的 `content.ts`、`minis.tsx` 和 `details.tsx`。

`npx pcafe dev`、`check`、`build` 都按名字選擇簡報，不需要手動改 `src/decks/active.ts`。開發時也可以直接開啟 `http://localhost:5173/?deck=my-deck`。

deck 檔案的骨架如下。每一頁就是一個範本，所有內容都通過 props 傳入：

```tsx
import type { DeckDef } from '../../kit'
import { Cover, MetricBars, Closing } from '../../kit'

export const deck: DeckDef = {
  title: 'Q3 Platform Review',          // 每頁左上角顯示，英文或短中文，≤ 32 個字元
  theme: 'crimson',                      // 配色，見第 13 節
  style: 'standard',                     // 風格，見第 13 節
  iconStyle: 'line-duotone',             // 圖示系列，見第 12 節
  slides: [
    {
      id: 'cover',                       // 唯一，只用小寫字母和連字元
      label: '封面',                      // 頁首和進度條提示裡顯示，2–6 字
      notes: '開場先講季度目標。',          // 演講備註，可選
      seconds: 60,                       // 計畫講多少秒，可選，演講者檢視排練計時用
      render: () => (
        <Cover
          kicker="Quarterly Review · 季度回顧"
          title="平台組 Q3"
          subtitle="steady"
          lead="……"
          facts={[{ label: '週期', value: '07–09 月' }, { label: '發布', value: '14 次' }]}
          numeral="Q3"
        />
      ),
    },
    // …
  ],
}
```

注意以下幾點：

- 需要 Bento 時，把範例裡 Bento 頁用到的 `content.ts`、`minis.tsx` 和 `details.tsx` 一起復制過來改寫，詳情頁和卡片小圖按 [第 10 節](#bento) 來寫。
- `title` 可以傳字串陣列，用來手動斷行，例如 `title={['新版本', '首次進入穩定通道']}`。較長的中文標題請都這樣處理，避免瀏覽器把一兩個字擠到第二行。

## 5. 文案規則

**長度怎麼數**：「字」指一個漢字；兩個英文字母、數字或空格算一個字。「個字元」指每個字元都算一個，用於數字、代號、指令等欄位。例如 `Deck Kit` 是 4 字，也是 8 個字元。

1. **標題是觀點，不是話題**。比如寫「舊版本已轉入長期維護」，不要寫「支援週期介紹」。標題不超過 16 個字。
2. **kicker 是話題**，2–8 字，例如「支援週期」「升級前」。
3. **lead 是證據或背景**，一到兩句，不超過 60 字。lead 不要複述標題。
4. **數字要帶單位和口徑**：「超過 14,000 個」「≈ 20%」「計畫日期」。估算值標「估算」，示意圖示「示意」。
5. **中文與英文、數字之間留一個半形空格**，例如「版本 13 的 64 位 time_t」。標點使用全形中文標點。
6. **不要寫空話**：去掉「全面升級」「賦能」「無縫」「極致」這類詞。用具體的名詞和數字來寫。
7. **指令和檔名照原樣寫**，並放進 `cmd`、`mono`、`tag` 這些等寬欄位，不要放在正文裡。
8. **正文裡避免一串長英文識別符號**。元件名、包名、路徑不能在中間斷行，三個連在一起就會把一行撐滿，所以放進 `tag`、`cmd` 這些欄位，或者只留一個。
9. **一段話的最後一行不要只剩一兩個字**。標題可以用陣列斷行；正文欄位不能手動斷行，只能改寫句子，縮短或加長几個字。
10. **同一個概念全篇只用一種叫法**。前面叫「LTS」，後面就不要改叫「長期維護版」。

## 6. 視覺規則

這些是範本已經做好的事，不要破壞。

- **不要寫自訂 CSS，也不要加內聯樣式**。字號、間距和顏色都在範本裡。需要不同的視覺效果時，換一個範本。
- **強調色只由範本來用**。顏色由 `DeckDef.theme` 決定（見 [第 13 節](#themes)），預設緋紅 `#e00052`。它出現在兩類地方：一類是系統標記，比如每頁的 kicker、編號、計數器、來源前的橫線；另一類是每頁唯一的焦點，比如 `Cover` 的大數字、`MetricBars` 的合計、`SpotlightList` 的第一項、`StepTrack` 的最後一步、`VerdictColumns` 的「推薦」組。你要做的只有一件事：不要在內容裡另外加顏色、加粗或使用 HTML 標籤來製造第二個焦點。
- **圖示只用內建圖示**（見 [第 12 節](#icons)），通過範本的 `icon` 欄位傳入名稱。不要放別的圖示庫或 emoji。其餘圖形都用 DOM/CSS 繪製，以保證離線、清晰和縮放一致。
- **不要引用任何遠端資源**（字型、圖片、腳本）。建置時會直接報錯。
- **畫布固定為 1920 × 1080**，自動等比縮放。在 CSS 裡 `24u` 表示設計稿上的 24px。不要使用 `px`、`vw` 寫佈局。
- **最小字號是 17u**，QA 會檢查。
- **強調要對上文字**：說「最長」就高亮最大的那一項，說「進行到第 3 步」就只填到第 3 步。

## 7. 事實與來源

- 頁面上有資料或事即時，必須填寫 `source`，寫明文件名加章節，例如 `2025 年度報告 §4.3`。
- 例外：`Cover` 和 `Closing` 沒有 `source` 欄位。封面上的事實必須在後面某一頁再次出現並帶上出處；`Closing` 的 `refs` 就是它的出處。
- 查不到的事實不要寫。沒有把握的地方，寧可刪掉那一頁。不要編造客戶評價、Logo、獎項。
- 會隨時間變化的內容（「已結束」「還剩 N 個月」）用 `Timeline` 的 `today` 和 `countdowns` 計算，不要寫死在文字裡。
- 示意性質的圖形要在圖注裡寫「示意」，範例公司和它的數字一律在 `source` 裡標「示意」。

<a id="qa-fixes"></a>

## 8. QA 報錯怎麼修

`npx pcafe check` 的最後一步是自動 QA：在 1920×1080、1366×768、2560×1440、1440×900 四種視窗下逐頁檢查，截圖存到 `qa/`，詳細結果寫入 `qa/report.json`。

### 給腳本和 AI 用的報告

每次 `check`（任何格式）都會另外寫出 `qa/reports/<格式>-<名字>.json`，完整輸出存在 `qa/reports/<格式>-<名字>.log`。每個問題都有級別（`fail`、`warn`、`hint`）、固定的代號、原文，能定位時還帶頁碼或原始檔和行號。代號：`fonts.*` `offline.*` `runtime.*` `source.*` `content.*` `text.*` (`text.too-small`, `text.contrast`, `text.unsettled`) `layout.*` (`layout.overflow`, `layout.safe-area`, `layout.overlap`, `layout.sideways-scroll`, `layout.empty`, `layout.widow`) `a11y.*` `nav.*` `build.*` `typecheck.TS…` `pdf.*` `print.*` `video.*` `course.*` `screen.*` `cards.*` `copy.*` `deck.*`。

- `npx pcafe check <name> --json`（其他格式用 `npx pcafe <格式> check <name> --json`）不列印建置過程，只輸出這份報告和 `next`。
- `npx pcafe status [格式] <name> [--json]` 讀取最近一次報告，告訴你下一步：`run_check`（還沒檢查過，或之後改過原始檔）、`fix`（按代號分組的問題，以及重跑的指令）、`review`（已通過：要看的截圖清單，看完給使用者確認）。它不會判定「已完成」，完成與否由使用者決定。

### 常見報錯

| 報錯 | 原因 | 修法 |
| --- | --- | --- |
| `text "…" outside the safe area` | 文字超出畫布安全區 | 按該範本的「內容上限」縮短文字，或減少行數、條目數 |
| `text collision: "A" × "B"` | 兩段文字重疊了 | 在 deck 檔案裡搜尋 A 的開頭幾個字，找到對應的欄位，把它縮短到下限和上限之間。常見情況有三種：標題太長換成了兩行（改用陣列斷行）；正文裡堆了長英文識別符號（移到 `tag` 或刪減）；某一列條目太多（刪掉一條）。`"1"`、`"2"` 這類單個數字通常是 `NumberedColumns` 底部的大編號，說明那一列的 body 太長 |
| `… clips content` | 內容超出容器被裁切 | 縮短那個欄位，常見於 Timeline 段內的 label 太長 |
| `font 15.0u too small` | 用了自訂的小字號 | 刪掉自訂樣式 |
| `font cjk400 not loaded`，或頁面上出現方框、字型粗細不一 | 新文字不在隨儲存庫提交的字型子集裡 | `npm run fonts:verify` 會列出缺字；`check` 給出帶缺字的警告並回退到系統字型。維護者用 `npm run fonts` 重新產生子集（需要 Python、fonttools 和 Noto CJK 原始檔） |
| `external requests …` | 引用了網路資源 | 刪掉遠端圖片、字型或連結資源 |
| `navigation: …` | 互動元素攔截了翻頁鍵 | 自訂元件不要監聽全域性鍵盤事件 |
| `slide … never settled …` | 頁面上有東西一直在變，QA 判斷不了何時結束 | 如果是即時元素（時鐘、跳動的數字），給該元素加 `data-settle-ignore`；否則刪掉不會結束的變化 |
| `detail …: card did not return` | 改動了 Bento 內部 | 撤銷對 `src/kit/Bento.tsx` 的修改 |
| `gallery …` | 範本庫頁面出錯 | 檢查 `src/kit/catalog.ts` 的 `demo` 是否對應 `deck` 欄位所指範例簡報中存在的頁面 id |
| 型別錯誤 `Type '"xxx"' is not assignable to type IconName` | 圖示名寫錯，或不在精選集裡 | 到 `#/kit/icons` 查名字；確實需要新圖示時按第 12 節新增 |

**WARN**：QA 還會輸出不算失敗的提醒，例如 `slide 4: content ends at y=640 … looks empty`，意思是這一頁下半部分基本是空的。看到這類提醒，按下面的截圖自查處理。

**截圖自查**（QA 不一定報，但會影響品質）：

- 整頁超過一半是空的：加一個 `pull`、`detail`、`countdowns` 這類可選塊，或者換成資訊更密的範本。
- 某一列明顯比其他列長或短（例如一組只有 1 項）：精簡長的那一列，或者給短的列補一條，讓各列項數相差不超過 1。
- 正文最後一行只剩一兩個字：改寫句子，見第 5 節第 9 條。
- 中文標題第二行只有一兩個字：改用陣列手動斷行。
- 裝飾件（手繪圈、高亮、箭頭）放大 2 倍看一遍：位置要對準，強調的內容要和文字一致。

`PASS` 之前可能會出現 `hint  copy.…` 開頭的提示行，標出文案裡的套話（「值得注意的是」「有研究表明」「未來可期」等）和所在檔案、行號。它們不會讓檢查失敗：能改就改；放在上下文裡確實準確的，可以保留。「有研究表明」「業內認為」這類說法要在 `source` 裡寫出具體出處。規則目前覆蓋中文和英文，也可以用 `node scripts/copy-lint.mjs <路徑>` 單獨檢查任何檔案。

長簡報（20 頁以上）還會出現 `hint  deck.…` 開頭的結構提示：沒有目錄（`deck.no-agenda`）、章節頁少於 2 個（`deck.few-sections`）、最後一頁不是收尾（`deck.no-closing`）、同一個範本連用 4 頁以上（`deck.repeat`，任何長度都查）、逐條展開的頁超過三分之一（`deck.builds`）。同樣不會讓檢查失敗。

`PASS` 並且每頁截圖都看過，才算完成。

## 9. 放映

快捷鍵、演講者檢視、匯出 PDF、紋理和翻頁方式見 [presenting.md](presenting.md)。

<a id="bento"></a>

## 10. 擴充套件：Bento 的小圖與詳情

Bento 每張卡片可以帶兩塊自訂內容：

- `mini`：卡片上的小圖形，用於第 2–6 格。參考範例簡報 Bento 頁旁邊的 `minis.tsx`：純 DOM 加已有的 `mini-*` 樣式，不超過卡片的視覺區。
- `detail`：展開後的右欄，必填。參考同目錄的 `details.tsx`，可以複用這些樣式類：

| 類名 | 用途 |
| --- | --- |
| `dv-label` | 小節標籤（等寬小字） |
| `dv-flow` | 2–3 個並排的大數字統計 |
| `dv-notes`（`dl > dt/dd`） | 鍵值說明列表 |
| `dv-code` 系列 | 前後程式碼對照面板 |
| `dv-stack` 系列 | 兩列版本對照表 |

寫完後在放映裡開啟每張卡片，確認詳情沒有超出卡片。QA 也會逐張檢查。

## 11. 新增範本

只有當某類內容反覆出現、現有範本都放不下時，才考慮新增範本。步驟見 [contributing.md](contributing.md)。寫簡報時不要改範本。

<a id="icons"></a>

## 12. 圖示

圖示來自 [Solar Icons](https://github.com/480-Design/Solar-Icon-Set)（CC BY 4.0，範本庫頁尾已署名）。`src/kit/icon-set.ts` 精選了一組圖示，分組整理；`#/kit/icons` 可以瀏覽全部圖示，點選複製名稱。[components.md](components.md) 最後的「圖示」一節也列出了全部名稱。

**選系列**：每個圖示有 6 個系列，整份簡報用同一個，寫在 `DeckDef` 上：

```tsx
export const deck: DeckDef = {
  title: '…',
  iconStyle: 'line-duotone', // 預設值；可選 bold-duotone、linear、outline、broken、bold
  slides: [ … ],
}
```

範本庫左側（窄屏在頁首）的「圖示系列」切換器會把所有預覽換成對應系列，用來挑選。

**用法**：範本裡的 `icon` 欄位直接寫名稱，例如 `icon: 'radar'`。在 Bento 詳情等自訂區域裡可以用 `<Icon>`：

| 寫法 | 效果 |
| --- | --- |
| `<Icon name="radar" />` | 48u，跟隨 `iconStyle`，副色層是半透明墨色 |
| `<Icon name="radar" size={36} />` | 尺寸按設計單位，常用 30–48 |
| `<Icon name="radar" tone="accent" />` | 副色層換成強調色。每頁最多一個，範本已經替焦點位置處理好了 |
| `<Icon name="radar" tone="mute" />` | 灰色，用於裝飾 |
| `<Icon name="radar" variant="bold" />` | 只讓這一個圖示換系列，一般不需要 |

**挑圖示的規則**

1. 按含義挑，不按好看挑：講「社群」用 `users`，講「檢索」用 `database`。
2. 同一頁裡不要重複用同一個圖示。
3. 圖示是輔助，不能代替文字：每個圖示旁邊都要有標題。
4. 精選集裡沒有合適的，按 [contributing.md](contributing.md#add-icon) 新增。

<a id="themes"></a>

## 13. 配色、深色頁與風格

每份簡報選一套強調色，寫在 `DeckDef.theme` 上。範本裡所有強調色位置（kicker、焦點數字、焦點條、淺色底、終端提示符）都會一起換：

```tsx
export const deck: DeckDef = {
  title: '…',
  theme: 'cobalt', // crimson（預設）· amber · cobalt · emerald · violet
  slides: [ … ],
}
```

| 名稱 | 色值 |
| --- | --- |
| `crimson` 緋紅 | `#e00052` |
| `amber` 橙 | `#eb5a0c` |
| `cobalt` 鈷藍 | `#2457f5` |
| `emerald` 翠綠 | `#0c9366` |
| `violet` 紫 | `#6c3cf0` |

範本庫左側的「強調色」切換器可以把所有預覽臨時換成某一套，選「隨簡報」則各自使用所屬簡報的配色。

每套配色還帶一組 `paper`：底色、卡片、分隔線都往強調色的方向偏一點，橙色配暖米色，鈷藍配冷白，翠綠配灰綠。換配色時底色會一起換，不需要另外設定。

<a id="tone"></a>

### 深色頁

單獨一頁可以設成深色，整塊畫布（包括頁首和進度條）都會反白，翻頁時平滑過渡：

```tsx
{ id: 'ch1', label: '看清買家', tone: 'dark', render: () => <SectionBreak … /> }
```

只在這幾個範本上用，它們都在深色下檢查過：`SectionBreak`、`QuoteHero`、`Teaser`、`Closing`、`Statement`。`FullBleed` 必須寫 `tone: 'dark'`。其餘範本有深色卡片或白字，放在深色頁上會看不清。一份簡報裡深色頁不要超過三分之一，最適合放在每章的第一頁和最後一頁，形成明暗節奏。

### 強調色整頁

`tone: 'accent'` 把整頁鋪滿主題色，文字反白，原來用強調色的地方（小標籤、關鍵詞）變成白色。它是最強的停頓，**一份簡報最多 2 頁**，只用在 `SectionBreak`、`Statement`、`Closing` 上。最典型的用法是一頁 `Statement` 把上一頁資料的結論單獨立住。

<a id="styles"></a>

### 風格

`DeckDef.style` 決定標題和大數字的字型、圓角、底色和裝飾，正文、字號、間距都不變，所以每個範本的內容上限照舊有效。它和配色互相獨立，任意組合。共 33 種：

| 場合 | 風格 |
| --- | --- |
| 正式簡報 | `standard`（預設）、`editorial`、`calm` |
| 發布會與品牌 | `keynote`、`toy3d`、`poster`、`gradient`、`warm-dark`、`nuance`、`agency`、`halo`、`electric` |
| 產品與工具 | `studio-dark`、`bento`、`soft-saas`、`float-ui`、`wallpaper`、`desktop` |
| 輕鬆分享 | `sticker`、`playful`、`pop`、`ribbon`、`mono-studio` |

每種風格的字型、底色和適合場合見 [skills/pcafe/references/styles.md](../../skills/pcafe/references/styles.md)（由程式碼產生）。

第三方包用 `pcafe` 的 `registerStyle(name, preset)` 註冊新風格。它的 CSS 必須寫在 `:root[data-style='name']` 下，不能只寫 `[data-style='name']`：引擎自己的變數寫在 `:root` 上，優先順序相同，後加載的規則也可能被蓋掉。

`mono-studio`、`keynote`、`warm-dark` 整份預設深色，不用寫 `tone`；某一頁要換回淺色時寫 `tone: 'light'`。預設深色的風格里只用深色下檢查過的範本：上面列出的五個，加上各圖表範本。

風格專屬範本（例如 `FloatCover`、`Desktop`、`KeyReveal`）儘量只在對應風格里用；它們在 components.md 的「適合」一行會寫明風格。

每種風格還提供 6 個點綴色 `--spot-1 … 6`（1 是主題色），只給圖示方塊（`IconTile`）和迷你介面的標籤用，不要用在正文上。

選風格之前先看樣張：開啟 `#/kit/styles`（風格樣張牆），同一頁按每種風格各排一遍並排對比；也可以用左側的「風格」切換器把所有預覽換成某一種風格。

展示字型只裁剪了 `src/` 裡出現過的字，`npx pcafe check` 不會重新裁剪：新打的字如果不在子集裡，會回退到系統字型，並在檢查裡給出缺字警告；要補進子集，維護者執行 `npm run fonts`，再用 `npm run fonts:verify` 校驗。

<a id="build"></a>

## 14. 逐條展開與翻頁銜接

### 逐條展開

給一頁加 `build`，講的時候就能一項一項出現：

```tsx
{ id: 'funnel', label: '轉化漏斗', build: 'reveal', render: () => <Funnel … /> }
```

- `'reveal'`：還沒講到的項先壓暗，每按一次 `→` 出現一項。
- `'focus'`：已經講過的也壓暗，只有目前這一項是亮的。適合一次只講一件事的頁面，比如 `Faq`、`Cycle`、`IssueTree`、`FlowDiagram`、`IndexStack`、`FolderCards`。

只有用 `→` 或 `Space` 進入這一頁時才逐條展開。用進度條、目錄、總覽或 `#/N` 跳過來時直接顯示全部內容，所以 QA 截圖和範本庫裡看到的都是完整的頁面。

哪些元素算一項由範本決定：列表、卡片、表格行、漏斗的每一級、熱力表的每一行、截圖的每個標註。寫 deck 時只需要加 `build`，不用管範本內部。

一頁裡少於 3 項時不要加 `build`。整份簡報裡逐條展開的頁不要超過三分之一，否則講的人要按太多次鍵。

### 翻頁銜接

目錄裡的章節編號會飛到下一頁章節頁的大號數字上（反過來也一樣）。這是 `Agenda` 和 `SectionBreak` 自帶的，不需要設定。

逐字出現的一句話用 `RevealStatement` 範本。

<a id="images"></a>

## 15. 圖片

`Screenshot`、`BeforeAfter`、`HeroPanel`、`TabbedShot`、`FullBleed` 和部分封面、章節頁用到圖片。圖片只有三類，都用 `import` 引入，其他來源的圖片不要用：

| 型別 | 檔名 | 放在哪 | 能做什麼 |
| --- | --- | --- | --- |
| 真實截圖 | 任意 | deck 目錄的 `assets/` | 可以當證據 |
| 相簿照片 | `photo-` 開頭 | `src/assets/photos/` | 只營造氛圍（封面、章節頁、場景配圖） |
| 裝飾插圖 | `decor-` 開頭 | deck 目錄的 `assets/` | 只做裝飾（背景、氛圍） |

- **真實截圖**：沒有截圖就換範本，不要拿示意圖冒充產品介面。`source` 寫清楚截的是什麼、什麼時候截的、怎麼截的。
- **`photo-` 照片**來自 Unsplash，不能冒充「我們的客戶、團隊、產品、辦公室」。`source` 裡寫「圖：Unsplash / 作者名」，作者和原連結記在 `src/assets/photos/credits.json`。照片不隨專案分發：執行 `npx pcafe photos`，用你自己的 `UNSPLASH_ACCESS_KEY` 下載到 `src/assets/photos/`，同時寫好 `credits.json`。
- **`decor-` 插圖**是 AI 產生的裝飾圖，不能當截圖、證據或資料圖，也不能出現真實品牌。
- 引入方式：`import shot from './assets/x.webp'`。打包時會內聯進單個 HTML 檔案。
- 用 WebP，單張 200 KB 以內。寬 1440–1600 畫素足夠。
- `ratio` 填圖片真實的寬高比；`BeforeAfter` 的兩張圖尺寸和構圖必須一致。

## 署名

使用 PCafe 製作的作品（簡報、報告、卡片、課程、螢幕、印刷、影片）會保留「由 PCafe 製作」署名，並連結到 https://p.cafe：簡報在第一頁和最後一頁的頁首以及控制欄顯示，其他格式顯示在頁尾。

`DeckDef.attribution: false`（以及其他格式定義裡的同名選項）只在安裝 `@pcafe/pro` 並持有有效的 PCafe Pro 許可時生效；沒有 Pro 時這個選項會被忽略，控制台會說明原因。

CPAL-1.0 第 15 條：把作品發布到網站上屬於 External Deployment（對外部署）。未修改引擎檔案的使用者，連結到公開儲存庫即可滿足原始碼要求；修改過引擎檔案的使用者，需要公開修改過的檔案。你自己的投影片內容不受影響。

## 16. Emoji

在任何格式的任何文字欄位裡直接打 emoji 就行：簡報、報告、履歷、卡片、影片、課件和展示螢幕都支援，不用改範本。emoji 由 PCafe 內建的素材繪製，換機器、匯出都長一樣。檔案裡只打包實際用到的 emoji。

```ts
export const deck: DeckDef = { title: '…', emojiStyle: 'fluent', slides: [ … ] }
```

| `emojiStyle` | 樣子 | 適合 |
| --- | --- | --- |
| `fluent`（預設） | 柔和、有立體感 | 螢幕、卡片、影片、普通 PDF |
| `flat` | 扁平色塊、檔案小 | 小尺寸、大幅印刷 |
| `noto` | 圓潤可愛 | 大幅印刷 |

想單獨擺一個 emoji 或指定大小，用 kit 裡的 `<Emoji e="🚀" size={64} />`。卡片封面可以用貼紙式主圖：`motif: { kind: 'emoji', e: '🎤', around: ['✨', '💡'] }`。在預覽地址後加 `?emoji=noto` 可以對比系列。全部 emoji 可以在開發預覽的 `#/kit/emoji` 瀏覽和搜尋。

限制：

- 不含國旗和膚色變體。用了會中止建置，並在報錯裡指出是哪一個。
- 用 SVG 文字畫的圖表標籤放不了圖片，寫了 emoji 會讓 QA 失敗。把它放到標題或正文裡。
- `fluent` 用了模糊效果，匯出 PDF 時會變成 300 ppi 的圖片，文字大小下足夠清晰。`flat` 和 `noto` 始終是向量，大幅印刷請用這兩種。

用量要剋制：一頁一兩個，放在希望被記住的地方，放在文字前面，不要代替文字。財報、法務檔案和事故通報裡不要用。社交卡片可以多放一些。

## 檔案地圖

```
src/
  deck/            放映引擎：畫布縮放、翻頁、逐條展開、翻頁銜接、總覽、演講者檢視（一般不用改）
  kit/             251 個範本 + catalog.ts（範本說明的唯一來源）+ theme.ts（配色與風格）+ Icon.tsx / icon-set.ts（圖示）
  decks/
    starter/       起步範本，npx pcafe new 從這裡複製
    <name>/        每份簡報一個目錄；assets/ 放截圖和裝飾圖
  assets/photos/   npx pcafe photos 下載的氛圍照片和 credits.json
  gallery/         #/kit 範本庫頁面
  styles/          範本與風格的樣式
cli/               PCafe 指令列
scripts/           自動 QA、文件產生、字型子集
docs/<語言>/        文件；components.md 由程式碼產生
skills/pcafe/  給 AI 助手的 skill 與參考表
```
