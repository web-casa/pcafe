<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->
# 參與貢獻：範本、風格與 QA

寫簡報時不改範本。這份文件寫給想給 PCafe 本身加東西的人：新範本、新風格、新配色、新圖示。改完都要跑一遍完整檢查。

## 原則

- 只有當某類內容反覆出現、現有範本都放不下時，才新增範本。能用現有範本拆頁、換角度解決的，不加。
- 範本說明（適合、避免、內容上限、props、範例）只寫在 `src/kit/catalog.ts` 一處。`docs/*/components.md` 和 `skills/pcafe/references/` 都由它產生，不要手改。
- 不寫死顏色：強調色一律用 `var(--accent)`、`var(--accent-ink)`、`var(--accent-wash)`、`var(--accent-soft)`，半透明寫 `rgb(var(--accent-rgb) / 0.16)`，否則換配色時不會跟著變。
- 不引用遠端資源，不放真實品牌名、Logo、真實公司資料。範例內容保持中性。

## 新增範本

1. 在 `src/kit/` 建立元件，props 繼承 `SlideBase`，並用 `SlideHead` / `SlideFoot` 保持統一的頭尾樣式。
2. 樣式寫進 `src/styles/` 下對應的樣式表，只使用 `u` 單位（`24u` 是設計稿上的 24px）和 `:root` 裡的顏色變數。內聯 `style` 不經過 `u` 換算，只能放無單位的數值或 CSS 變數。最小字號 17u。
3. 要支援逐條展開時，在每一項的最外層加 `data-build`（`Reveal` 上寫 `build`）；幾個元素要同時出現時給它們相同的值，比如 `data-build={row}`。同一個數字在相鄰兩頁出現時，可以給它們加同一個 `data-morph`（或在 `Numeral` 上傳 `morph`），翻頁時會連起來過渡。
4. 在 `src/kit/index.ts` 匯出元件，在 `src/kit/catalog.ts` 登記：寫清適合、避免、內容上限、props 和範例。風格專屬範本在「適合」裡寫明風格。
5. 在某份範例簡報里加一頁來簡報它，`demo` 指向這一頁的 id，`deck` 寫這份範例簡報的名字。
6. 想支援 `tone: 'dark'` / `'accent'`，要在深色和強調色下都檢查過，並更新 [guide.md 第 13 節](guide.md#tone) 的列表。
7. 執行 `npx pcafe docs` 重新產生參考文件，再執行 `npx pcafe check <範例簡報名>`。

## 新增風格

風格只改標題和大數字的字型、圓角係數、底色和裝飾，不改正文字號和間距，這樣每個範本的內容上限在所有風格下都有效。

1. 參照已有的風格預設（例如 `src/kit/styles/bento.ts`）建立一個 `StylePreset`：`label`、`note`（一句話：長什麼樣、適合什麼場合）、`radius`、`paper`，整份預設深色的再加 `tone: 'dark'`。
2. 在 `src/kit/theme.ts` 的 `STYLES` 裡登記，樣式放進 `src/styles/` 下對應的樣式表。
3. 開啟 `#/kit/styles`，確認每個範本在新風格下都沒有破版；預設深色的風格要逐個檢查深色下的可讀性。
4. 加一份用這種風格的範例簡報，執行 `npx pcafe docs` 和 `npx pcafe check`。

## 新增配色

在 `src/kit/theme.ts` 的 `THEMES` 里加一項，每個欄位都要填：`accent`、`ink`、`wash`、`rgb`、`soft`（用在深色背景上）和一組 `paper`（底色、卡片、分隔線往強調色方向偏一點）。在 `#/kit` 用「強調色」切換器把所有範本過一遍。

<a id="add-icon"></a>

## 新增圖示

精選集裡沒有合適的圖示時，到 [solar-icons.vercel.app](https://solar-icons.vercel.app) 找名字，在 `src/kit/icon-set.ts` 對應分組裡加一行 `name: XxxIcon`（從 `@solar-icons/react/dynamic` 匯入），型別檢查和圖示索引會自動更新。名字要說清它畫的是什麼：Solar 的 `ScaleIcon` 是體重秤，所以登記為 `weight-scale`，而不是 `scale`。

## QA 規則

`npx pcafe check` 依次執行型別檢查、建置和自動 QA，最後一行是 `PASS` 或 `FAIL (n)`。自動 QA 在 1920×1080、1366×768、2560×1440、1440×900 四種視窗下逐頁檢查：

- 文字是否超出安全區、互相重疊、被容器裁切
- 字號是否小於 17u，字型是否載入
- 是否有外部網路請求
- 翻頁鍵是否被攔截，逐條展開、總覽、Bento 詳情能否正常進出
- 範本庫頁面能否正常開啟，`catalog.ts` 的 `demo` 是否指向存在的頁面
- 頁面下半部分是否偏空（只出 WARN）

報錯的修法見 [guide.md 第 8 節](guide.md#qa-fixes)。截圖存在 `qa/`，結果寫在 `qa/report.json`。

QA 抓不到的也要看：逐頁開啟 `qa/slide-NN-1920x1080.png`，手繪圈、高亮、箭頭這類裝飾件放大 2 倍檢查，位置要對準，強調的內容要和文字一致。

## 重新產生文件

```bash
npx pcafe docs
```

改了 `src/kit/catalog.ts`、風格預設或配色之後都要執行。它會重新產生各語言的 `docs/*/components.md` 和 `skills/pcafe/references/` 下的範本表、風格表。

## 提交前

- `npx pcafe check` 對受影響的範例簡報輸出 `PASS`
- 截圖逐頁看過
- `npx pcafe docs` 已執行，產生的檔案一起提交
- 新增的第三方字型、圖示、程式碼已寫進 `THIRD_PARTY_LICENSES.md`
