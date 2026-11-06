<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->
# PCafe 入門

PCafe 用 251 個固定範本拼出 16:9 的 HTML 簡報，最後輸出一個可以離線開啟的單檔案 HTML。版式、字型、配色和動效都已經在範本裡定好，寫一份新簡報只需要三步：

1. 選範本
2. 填內容
3. 跑檢查

只要不改範本、不寫自訂 CSS，並且遵守每個範本的內容上限，做出來的效果就和範例簡報一致。這套約束也讓 AI 助手能穩定地寫出合格的簡報。

- 251 個範本：封面、資料圖表、對比、結構圖、時間線、截圖、節奏頁等
- 33 種風格（`DeckDef.style`）× 5 套配色（`DeckDef.theme`），任意組合
- 放映功能齊全：逐條展開、總覽、演講者檢視、雷射筆、畫筆、匯出 PDF
- 自動 QA：四種視窗尺寸逐頁檢查溢位、重疊、字號和遠端資源，最後輸出 `PASS` 或 `FAIL`

## 安裝

需要 Node.js 20.19 或更高版本。

```bash
npx @pcafe/pcafe init my-talk      # 在 my-talk/ 產生一個專案
cd my-talk
npm install
```

## 5 分鐘做第一份簡報

```bash
npx pcafe new q3-review     # 從起步範本產生 src/decks/q3-review/index.tsx
npx pcafe dev q3-review     # 開啟開發預覽，改檔案後自動重新整理
```

開啟 `src/decks/q3-review/index.tsx`，每一頁就是一個範本，內容都通過 props 傳入：

```tsx
import type { DeckDef } from '../../kit'
import { Cover, StatRow, Closing } from '../../kit'

export const deck: DeckDef = {
  title: 'Q3 Review',
  theme: 'cobalt',        // 配色
  style: 'standard',      // 風格
  slides: [
    { id: 'cover', label: '封面', render: () => <Cover kicker="季度回顧" title="平台組 Q3" … /> },
    { id: 'numbers', label: '規模', build: 'reveal', render: () => <StatRow … source="出處" /> },
    { id: 'end', label: '結論', render: () => <Closing statement="……" … /> },
  ],
}
```

改完之後：

```bash
npx pcafe check q3-review   # 型別檢查 + 建置 + 自動 QA，最後一行必須是 PASS
npx pcafe build q3-review   # 產生 dist/q3-review.html，單檔案，可以直接發給別人
```

`check` 輸出 `FAIL` 時按 [guide.md 第 8 節](guide.md#qa-fixes) 修復。每頁截圖在 `qa/slide-NN-1920x1080.png`，逐頁看過才算完成。

開發預覽裡開啟 `#/kit` 可以瀏覽全部範本、風格樣張和圖示。

## 配合 AI 助手使用

專案根目錄的 `AGENTS.md`（Claude Code 讀 `CLAUDE.md`）告訴 AI 助手這裡的規則。`skills/pcafe/` 是一份寫簡報的 skill：怎麼寫故事線、怎麼按內容形狀挑範本、怎麼把文字壓進上限、怎麼跑檢查。中文版是 [SKILL.md](../../skills/pcafe/SKILL.md)，參考表在 `skills/pcafe/references/`。

常見做法：把資料交給 AI 助手，說「用 PCafe 做一份 10 頁的季度簡報」，它會建立 deck、填內容、執行 `npx pcafe check` 直到 `PASS`。

## 文件導航

| 文件 | 內容 |
| --- | --- |
| [guide.md](guide.md) | 寫簡報的流程與規則：故事線、選範本、文案、事實來源、QA 報錯怎麼修、配色與風格、圖片 |
| [components.md](components.md) | 每個範本的適合場景、避免場景、內容上限、props 和範例（由程式碼產生） |
| [presenting.md](presenting.md) | 放映、快捷鍵、演講者檢視、匯出 PDF、紋理與翻頁方式 |
| [paper.md](paper.md) | 報告與履歷：A4 分頁、閱讀檢視、PDF |
| [cards.md](cards.md) | 社交卡片和輪播圖：各平台尺寸的 PNG，LinkedIn 用的 PDF |
| [video.md](video.md) | 動畫影片：逐幀渲染的 MP4，16:9 或 9:16 |
| [course.md](course.md) | 用於自學的互動課程：一個帶練習的離線 HTML 檔案 |
| [screen.md](screen.md) | 展廳、櫥窗或活動用的迴圈展示螢幕：一個離線 HTML 檔案 |
| [print.md](print.md) | 海報、易拉寶、三折頁和資訊長圖：帶出血和裁切標記的 PDF，以及 PNG |
| [contributing.md](contributing.md) | 新增範本、風格和配色，QA 規則，重新產生文件 |

其他語言：[English](../en/README.md) · [简体中文](../zh-CN/README.md)
