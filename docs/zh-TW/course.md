<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->
# 互動課程

一個離線 HTML 檔案就是一節自學課：簡短的講解，每個答案都有解釋的練習，還可以加一個模擬實驗。不需要伺服器，也不需要帳號。

```bash
npx pcafe course new s3-basics       # 產生 src/courses/s3-basics/index.tsx
npx pcafe course dev s3-basics       # 預覽
npx pcafe course check s3-basics     # 型別檢查、建置、QA，最後一行是 PASS 或 FAIL
npx pcafe course build s3-basics     # 輸出 dist/course/s3-basics.html
```

檔案放在 `src/courses/<name>/index.tsx`。寫完要跑到 `PASS`，並看過 `qa/course/<name>/desktop/` 和 `qa/course/<name>/phone/` 裡的截圖。

`check` 需要 Playwright 的 Chromium（`npx playwright install chromium`），依次執行型別檢查 → 建置 → QA。首次執行若沒裝瀏覽器，會列印這條安裝指令並以非零狀態退出。檢查和建置都不再需要 Python 或系統字型：CJK 子集隨儲存庫提交，`npm run fonts:verify` 負責校驗；`npm run fonts` 只給維護者重新產生子集。`build` 不跑 QA，所以要在 `check` 之後用，不能代替它。

QA 的重新整理測試至少需要四道不是閃卡的題，起始範本正好四道，刪題時要注意。`course new` 會把 `id` 設成課程名。`id` 是儲存學習進度用的鍵，課程改動大到舊進度沒有意義時，要換一個。

## 一門課

`CourseDef` 只有資料，繪製、判分和儲存進度都由引擎完成。

| 欄位 | 用途 |
| --- | --- |
| `id` | 儲存鍵。課程改動大到舊進度沒有意義時，就改它 |
| `title`、`lead` | 封面文字。`lead` 是一句話 |
| `lang`、`theme`、`iconStyle`、`look` | `zh` 或 `en`；配色；圖示系列；`editorial` 或 `formal` |
| `minutes` | `[下限, 上限]`，你的估算。封面上會標明是估算 |
| `objectives` | 學完能做的 3–5 件事 |
| `hero` | 封面插圖，必須能說明內容 |
| `concepts` | `{ key: { label, review } }`。`review` 是答錯後送學習者回去的步驟 id。每個概念至少要有一道練習 |
| `sources` | `{ key: { org, title, url?, note? } }`。各步驟引用這裡的 key |
| `sections` | `{ id, title, steps }` |

每一步是下面三種之一：

| `kind` | 欄位 | 計分 |
| --- | --- | --- |
| `read` | `id`、`title`、`blocks`、`cites`、`illustrative?` | 否 |
| `practice` | `id`、`concept`、`exercise`、`cites`、`pretest?` | 是，`pretest` 和閃卡除外 |
| `lab` | `id`、`concept`、`title`、`lead`、`simulation`、`tasks`、`render`、`solve`、`cites` | 否 |

`pretest` 是開場題，學習者多半會答錯。它會揭曉答案並給出解釋，但不計分。

## 練習

| `type` | 欄位 | 規則 |
| --- | --- | --- |
| `single` | `prompt`、`options`、`given?` | 只有一個正確項，3–6 個選項 |
| `multi` | `prompt`、`options`、`given?` | 至少一對一錯，3–6 個選項 |
| `truefalse` | `statement`、`answer`、`why` | |
| `order` | `prompt`、`items`、`ends?`、`why` | `items` 按正確順序寫，3–6 項，引擎會打亂。用上下按鈕，不用拖動 |
| `match` | `prompt`、`pairs`、`decoys?` | 3–5 對 `left`、`right`、`why`。先點空位，再點選項 |
| `cloze` | `prompt`、`text`、`why`、`mono?` | 空格寫成 `{{答案\|別名}}`。不區分大小寫，忽略首尾空格和全形半形 |
| `flashcards` | `prompt`、`cards` | 至少 2 張。學習者自評，永不計分。標為「沒想起來」的卡片會回到重做輪 |

`single` 和 `multi` 的每個選項都有 `text`、`correct?` 和自己的 `why`，對錯都要寫，兩個選項不能共用一條。`given` 是一組 `{ label, value }`，替學習者先答好前幾步，做成漸隱的例題。

算分只看第一次作答，之後不會覆蓋，也不能當場重答。結果頁按概念簡報，並提供兩種回合：重做輪只練答錯的題；複習輪最多 8 道計分題，優先挑仍然答錯的。任何一步都可以跳過，也可以從目錄開啟。

## 內容上限

按字元計算，每個字元都算 1，英文字母也一樣。行內的 `*` 和 `` ` `` 不算。超出就 FAIL。

| 欄位 | 上限 |
| --- | --- |
| 步驟 `title`（read、lab） | 26 |
| `prompt` | 90 |
| `statement` | 70 |
| 選項 `text` | 70 |
| 所有 `why` | 10–110 |
| 閃卡 `front`、`back` | 90 |
| 任務 `text` | 44 |
| 講解步驟的 `blocks` | 6 |

`src/course/types.ts` 還要求這些，但 QA 不檢查：章節 `title` ≤ 16，課程 `lead` ≤ 60，概念 `label` ≤ 12，每條目標 ≤ 40，配對和實驗任務的 `why` ≤ 90。

## 講解步驟可用的版塊

`Lead`、`P`、`Bullets`、`Note`、`Code`、`Figure`（`illustrative` 標明是示意）、`Facts`（2–4 個數字）、`Compare`（2–3 列）、`Ladder`（3–6 行）、`Timeline`（3–5 站）、`Worked`（每條理由點開才顯示）和 `SlideFigure`（一張 kit 投影片，必須提供手機用的 `narrow` 版本）。從 `../../course` 引入。像起始範本那樣，給 `blocks` 裡的每個元素寫 React `key`。

## 實驗

`render` 會收到已完成的任務、`complete` 函式和任務清單。`simulation` 是說明「這是模擬」的那句話，和實驗一起顯示，必填。`solve` 是一段由 `{ click }`、`{ fill: [選擇器, 文字] }` 和 `{ expect }` 組成的腳本，讓 QA 能用滑鼠、手指和鍵盤把實驗走一遍。

QA 的手機測試還會按 `[data-fill]` 和 `[data-send]`，並查詢 `[data-response]`，所以實驗沒有這些屬性就會 FAIL。可以參考 `src/courses/object-storage/S3Lab.tsx`。

## 規則

- 一步只講一個想法。放不下就拆成兩步。
- 先寫練習，再寫練習需要的講解。
- 每條 `why` 都要說明這個答案為什麼對，或者它代表哪種錯誤。這套設計依據的研究顯示，只判對錯的反饋幫助很小（見程式碼儲存庫的 `plans/research-course.md`）。
- 事實必須有出處。練習和實驗必須引用來源；講解步驟要麼引用來源，要麼寫 `illustrative: true`，表示沒有陳述外部事實。查不到出處的事實不要寫。虛構的場景要標明是虛構。
- 課程內容裡不放照片和裝飾圖，它們會分散新手的注意力。`Figure` 用來說明內容。
- 不用積分、連續打卡、計時器和記憶留存百分比。不要聲稱一門課能帶來學習提升，這一點沒有測量過。

## QA 檢查什麼

QA 在 Chromium 裡不靠人工把整節課走完：1440 px 寬用滑鼠、390 px 寬用觸屏，各走一遍全對和一遍全錯，再只用鍵盤走一遍。還會走重做輪和複習輪、重新整理後繼續、儲存被停用、寫滿和損壞的情況、目錄抽屜，以及每一步的深連結。

每一屏檢查：橫向滾動、只有一個 `h1`、控制元件有名稱、點選目標不小於 24×24 px、文字不小於 11 px、對比度、圖片有 `alt`、沒有網路請求。每次作答後檢查：判定正確、有文字和圖示而不是只靠顏色、讀屏軟體能讀到的狀態區域、每個選項都有解釋、顯示引用的來源。結果頁檢查：數字加得起來，列印時保留表格和錯題。`src/course/validate.ts` 裡的所有規則在這裡也會 FAIL：上面的上限、缺 `cites`、未知概念、沒有練習的概念、沒有計分題、來源列表為空。

結果在 `qa/course/<name>/report.json`。

## 已知限制

- 答案就寫在 HTML 檔案裡，誰都能讀到。課程只用於自學，不能用於考試。
- 進度只存在 `localStorage`，也就是這台裝置的這個瀏覽器裡。移動或重新命名檔案、清理瀏覽器資料、關閉隱私視窗都會丟失進度。頁面上會說明這一點，列印結果頁是唯一能長期保留的記錄。這個檔案也發不了提醒。
- 只測過 Chromium。沒有跑過 Safari 和 Firefox，也沒有用真實的讀屏軟體測試：QA 檢查的是角色、名稱和即時區域的文字，不是讀出來的效果。
- 還沒有真實的學習者用過。研究說明的是設計為什麼這樣做，這裡沒有任何東西證明一節課能產生那些效果。
- 封面上的時間是根據內容量的估算，沒有人實際計時。
