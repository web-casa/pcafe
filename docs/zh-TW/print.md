<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->
# 印刷和長圖

海報、易拉寶、A4 三折頁和資訊長圖。尺寸按實物來定：一份原始檔產出帶出血和裁切標記的 PDF、PNG，以及一個可以離線預覽的 HTML 檔案。

```bash
npx pcafe print new my-poster       # 建立 src/prints/my-poster/
npx pcafe print dev my-poster       # 預覽
npx pcafe print check my-poster     # 型別檢查、匯出、QA；最後一行是 PASS 或 FAIL
npx pcafe print build my-poster     # 寫出 dist/print/my-poster.html 和 dist/print/my-poster/
```

範本裡每種格式一個檔案：在 `index.tsx` 裡保留要用的那一行匯出，刪掉其他檔案。完成的標準是 `PASS`，並且按原尺寸看過每張 PNG，看過 `qa/print/<name>/` 裡的參考線圖（標出安全區、折線和隱藏區）。每個數字的依據和出處見 [`plans/research-print.md`](../../plans/research-print.md)。

## 選預設

| 成品 | `format` | `preset` |
| --- | --- | --- |
| 海報 | `poster` | `poster-a3`、`poster-a2`、`poster-a1`、`poster-50x70` |
| 易拉寶 | `rollup` | `rollup-80x200`、`rollup-60x160`、`rollup-85x200` |
| A4 三折頁 | `trifold` | `trifold-a4` |
| 資訊長圖 | `long` | `long-1080`、`long-750` |

```tsx
export const print = definePrint({
  title: '月球海報',
  format: 'poster',
  preset: 'poster-50x70',
  theme: 'cobalt',
  style: 'editorial',
  viewing: { distanceM: 3, readM: 1.2, nearM: 0.6 },
  render: () => (
    <Stack grow gap={12}>
      <Title lines={['一張海報', '只說一件事']} mark={[1]} fit />
      <Kit part=".race__board" label="排名" dw={780} dh={760}>
        <RankingRace kicker="" title="" periods={YEARS} items={ITEMS} show={7} />
      </Kit>
      <Sources>來源：機構、標題、年份。</Sources>
    </Stack>
  ),
})
```

## 規則

- **先說在哪裡看。** 海報和易拉寶的最小字號由 `viewing` 決定：`distanceM` 對應標題，`readM` 對應正文，`nearM` 對應出處。放不下就刪字，不要縮字號。
- **每個事實的出處都印在成品上。** 長圖的出處寫在每一段上，因為切片可能被單獨發出去。
- **虛構內容必須寫 `sample`。** 每一頁都會印上標註。
- **易拉寶：** 向印廠問清楚實際隱藏高度，寫進 `hiddenBottomMm` 和 `topBarMm`。預設的 150 mm 只是偏保守的取值，不是哪家印廠的規格，不同支架差別很大。
- **三折頁：** 外面從左到右依次是內折頁、封底、封面，內折頁窄 3 mm，文字要避開折線。寬度請和印廠範本核對。
- **長圖：** `slices: ['wechat', 'xhs']` 會同時切片，切口都在段與段之間。某一段比一張切片還高時，QA 不通過。
- **Emoji：** 印刷預設用 `noto`，始終是向量。`fluent` 也夠清晰，但檔案會大很多。

## 使用元件

`Kit` 顯示範本裡的一個部分，不帶投影片外框。`dw` 和 `dh` 是排版用的投影片尺寸，含外框邊距（橫向 144u，縱向 236u）；`dw` 小於 1000 時改成單欄。這些選擇器測試過：`.x2-sf__board`、`.x2-od__row`、`.x2-tm__wordbox`、`.x2-ta__art`、`.v35nine__row`、`.v35ana`、`.v35verb`、`.v35tier`、`.line`、`.sarea`、`.race__board`、`.miles`、`.steps__list`、`.metrics`、`.claims`、`.glow`、`.cluster`。

## 產物

| 檔案 | 用途 |
| --- | --- |
| `<name>-print.pdf` | 成品尺寸加出血，外加 8 mm 放裁切標記 |
| `<name>-bleed.pdf` | 正好是成品尺寸加出血，給自己加標記的印廠 |
| `<name>-proof.pdf` | 成品尺寸，用於螢幕檢視；易拉寶只顯示可見區域 |
| `<name>.png` | 成品預覽；三折頁是 `-outside` 和 `-inside` 兩張 |
| `<name>.pdf`、`<name>.png`、`slices/` | 長圖 |

## QA 檢查什麼

安全區、溢位、重疊、PDF 頁面框是否精確、字型是否嵌入、按宣告距離計算的物理字號、圖片解析度、對比度、文字是否跨折線、易拉寶隱藏區裡有沒有內容、切片是否切斷段落、數字有沒有出處，以及頁面就緒後文字是否還在變化。`node scripts/print-selftest.mjs` 會驗證每條規則確實能報錯。

## 已知限制

- **顏色：** 瀏覽器只能輸出 RGB，檔案不是 PDF/X，也沒有輸出意圖。請印廠用自己的設定轉 CMYK，並把黑色文字對映成 100 K。高飽和的藍和紫偏色最明顯，包括 `cobalt` 和 `violet` 配色；顏色重要時請先打樣。
- **字型：** 以 Type 3 形式嵌入，部分印前檢查工具會給出警告。
- **沒有上機驗證：** 這些檔案都沒有經過真實印刷機或 RIP。大批次印刷前，請和印廠確認尺寸、出血和隱藏高度。
- **平台限制：** 公眾號和小紅書的長圖數字來自第三方資料，不是平台官方規格。
- **觀看距離：** QA 只按你宣告的距離計算。
