<!-- 本檔案由 scripts/zh-tw.mjs 從簡體中文自動轉換產生，請改簡體原文後執行 npm run docs。 -->
# PCafe

[English](README.md) · [简体中文](README.zh-CN.md) · **繁體中文**

給 AI 做簡報用的 HTML 投影片引擎。251 個固定範本、33 種風格、5 套配色，輸出一個可以離線開啟的單檔案 HTML。

版式、字型、配色和動效都已經在範本裡定好。寫簡報的人（或 AI 助手）只做三件事：選範本、填內容、跑檢查。只要不改範本、不寫自訂 CSS、遵守每個範本的內容上限，效果就和範例簡報一致。

## 功能

- **251 個範本**：封面、章節頁、資料圖表（柱狀、折線、環形、瀑布、漏斗、熱力表……）、對比、結構圖（金字塔、維恩圖、魚骨圖、泳道……）、時間線與路線圖、截圖標註、節奏頁
- **33 種風格 × 5 套配色**：從正式簡報到發布會、產品介紹、輕鬆分享，任意組合；風格只改字型、圓角、底色和裝飾，內容上限不變
- **每個範本都有內容上限**：每個欄位寫多少字、幾條都有明確規定，寫在 [範本參考](docs/zh-TW/components.md) 裡
- **自動 QA**：在四種視窗尺寸下逐頁檢查文字溢位、重疊、裁切、字號和遠端請求，最後一行輸出 `PASS` 或 `FAIL`
- **放映功能**：逐條展開、總覽、演講者檢視和備註、雷射筆、畫筆、區域性放大、自動播放、匯出 PDF
- **單檔案離線**：字型、圖示、圖片全部內聯，發給別人用瀏覽器直接開啟

## 快速開始

需要 Node.js 20.19 或更高版本。

```bash
npx @pcafe/pcafe init my-talk      # 產生專案
cd my-talk && npm install
npx pcafe new q3-review     # 建立 src/decks/q3-review/index.tsx
npx pcafe dev q3-review     # 開發預覽
npx pcafe check q3-review   # 型別檢查 + 建置 + QA，最後一行是 PASS / FAIL
npx pcafe build q3-review   # 產出 dist/q3-review.html
```

| 指令 | 作用 |
| --- | --- |
| `npx @pcafe/pcafe init <dir>` | 在 `<dir>` 產生一個新專案 |
| `npx pcafe new <name>` | 從起步範本產生 `src/decks/<name>/index.tsx` |
| `npx pcafe dev <name>` | 開發預覽，`#/kit` 瀏覽範本庫 |
| `npx pcafe check <name>` | 型別檢查、建置、自動 QA |
| `npx pcafe build <name>` | 產出 `dist/<name>.html`（單檔案，離線） |
| `npx pcafe docs` | 重新產生範本參考 |
| `npx pcafe photos` | 用你自己的 Unsplash key 下載可選的氛圍照片 |

## 配合 AI 助手使用

- [`AGENTS.md`](AGENTS.md)（Claude Code 讀 [`CLAUDE.md`](CLAUDE.md)）寫著 AI 助手必須遵守的規則：只組合範本、遵守內容上限、事實要有出處、`check` 輸出 `PASS` 才算完成。
- [`skills/pcafe/`](skills/pcafe/) 是一份寫簡報的 skill：故事線、按內容形狀挑範本、把文字壓進上限、選風格、檢查與看圖。可以裝進支援 skill 的工具，也可以讓任何 AI 直接讀。參考表在 `skills/pcafe/references/`。

把資料交給 AI 助手，說「用 PCafe 做一份 10 頁的季度簡報」，它會建立 deck、填內容、反覆執行 `npx pcafe check` 直到 `PASS`。

## 圖片規則

圖片只有三類，都用 `import` 引入：

| 型別 | 檔名 | 用途 |
| --- | --- | --- |
| 真實截圖 | 任意，放在 deck 目錄的 `assets/` | 可以當證據 |
| 相簿照片 | `photo-` 開頭，放在 `src/assets/photos/` | 只營造氛圍，不能冒充你的客戶、團隊、產品或辦公室；`source` 寫「圖：Unsplash / 作者名」 |
| 裝飾插圖 | `decor-` 開頭 | AI 產生，只做裝飾，不能冒充截圖或證據 |

照片不隨專案分發。需要時執行 `npx pcafe photos`，用你自己的 `UNSPLASH_ACCESS_KEY` 下載，作者和原連結會寫進 `src/assets/photos/credits.json`。

## 文件

- [入門](docs/zh-TW/README.md)
- [寫簡報：流程與規則](docs/zh-TW/guide.md)
- [範本參考](docs/zh-TW/components.md)
- [放映、演講者檢視與匯出](docs/zh-TW/presenting.md)
- [參與貢獻](docs/zh-TW/contributing.md)

## 署名

使用 PCafe 製作的作品（簡報、報告、卡片、課程、螢幕、印刷、影片）會保留「由 PCafe 製作」署名，並連結到 https://p.cafe：簡報在第一頁和最後一頁的頁首以及控制欄顯示，其他格式顯示在頁尾。

`DeckDef.attribution: false`（以及其他格式定義裡的同名選項）只在安裝 `@pcafe/pro` 並持有有效的 PCafe Pro 許可時生效；沒有 Pro 時這個選項會被忽略，控制台會說明原因。

CPAL-1.0 第 15 條：把作品發布到網站上屬於 External Deployment（對外部署）。未修改引擎檔案的使用者，連結到公開儲存庫即可滿足原始碼要求；修改過引擎檔案的使用者，需要公開修改過的檔案。你自己的投影片內容不受影響。

## 授權

開源（CPAL-1.0），可免費商用，作品需保留「由 PCafe 製作」署名和連結；Pro 可去掉署名。見 [LICENSE](LICENSE)。第三方字型、圖示等的許可見 [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)。
